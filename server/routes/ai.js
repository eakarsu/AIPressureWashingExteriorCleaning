const router = require('express').Router();
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const pool = require('../db');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function callOpenRouter(systemPrompt, userMessage) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3001',
      'X-Title': 'AI Pressure Washing & Exterior Cleaning',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseAIJson(text) {
  // Strategy 1: markdown code block
  try {
    const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (m) return JSON.parse(m[1].trim());
  } catch (_) {}
  // Strategy 2: bare JSON object
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
  } catch (_) {}
  // Strategy 3: whole text
  try { return JSON.parse(text); } catch (_) {}
  return { raw_response: text };
}

async function saveAIResult(userId, feature, action, inputData, outputData) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        feature VARCHAR(100),
        action VARCHAR(100),
        entity_type VARCHAR(100),
        entity_id INTEGER,
        input_data JSONB,
        output_data JSONB,
        model_used VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(
      `INSERT INTO ai_results (user_id, feature, action, input_data, output_data, model_used, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [userId || null, feature, action, JSON.stringify(inputData), JSON.stringify(outputData), MODEL]
    );
  } catch (err) {
    console.error('saveAIResult error:', err.message);
  }
}

// ─── POST /api/ai/quote-estimate ──────────────────────────────────────────────

router.post('/quote-estimate', auth, aiRateLimiter, async (req, res) => {
  try {
    const { property_type, square_footage, services, surface_type, condition, num_stories, additional_details } = req.body;

    const systemPrompt = `You are an expert pressure washing and exterior cleaning estimator with 20+ years of industry experience. Provide accurate, detailed cost estimates. Format response as JSON with keys: estimated_low (number), estimated_high (number), line_items (array of {description, quantity, unit_price, total}), estimated_hours (number), recommended_crew_size (number), special_notes (array of strings).`;

    const userMessage = `Estimate the cost for this pressure washing job:
- Property Type: ${property_type || 'residential'}
- Square Footage: ${square_footage || 'unknown'}
- Services Requested: ${Array.isArray(services) ? services.join(', ') : services || 'general pressure washing'}
- Surface Type: ${surface_type || 'not specified'}
- Surface Condition: ${condition || 'average'}
- Number of Stories: ${num_stories || 1}
- Additional Details: ${additional_details || 'none'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'quote-estimate', 'generate', req.body, parsed);

    res.json({ success: true, estimate: parsed });
  } catch (err) {
    console.error('AI quote estimate error:', err);
    res.status(500).json({ error: 'Failed to generate quote estimate' });
  }
});

// ─── POST /api/ai/chemical-recommendation ────────────────────────────────────

router.post('/chemical-recommendation', auth, aiRateLimiter, async (req, res) => {
  try {
    const { surface_type, stain_type, condition, area_sqft, environmental_concerns } = req.body;

    const systemPrompt = `You are an expert in pressure washing chemicals. Provide chemical mix recommendations. Format as JSON with keys: primary_mix (object with chemicals and ratios), application_method, dwell_time_minutes, rinse_procedure, safety_precautions (array), environmental_notes (array), warnings (array).`;

    const userMessage = `Recommend the best chemical mix for:
- Surface Type: ${surface_type || 'not specified'}
- Stain/Dirt Type: ${stain_type || 'general grime'}
- Surface Condition: ${condition || 'moderate'}
- Area Size: ${area_sqft || 'unknown'} sq ft
- Environmental Concerns: ${environmental_concerns || 'none specified'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'chemical-recommendation', 'generate', req.body, parsed);

    res.json({ success: true, recommendation: parsed });
  } catch (err) {
    console.error('AI chemical recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate chemical recommendation' });
  }
});

// ─── POST /api/ai/weather-scheduling ─────────────────────────────────────────

router.post('/weather-scheduling', auth, aiRateLimiter, async (req, res) => {
  try {
    const { location, scheduled_dates, services, crew_count, jobs } = req.body;

    const systemPrompt = `You are an expert pressure washing scheduler optimizing job scheduling based on weather conditions. Format response as JSON with keys: schedule_recommendations (array of objects with job_id, recommended_date, time_window, reason), reschedule_suggestions (array), weather_alerts (array), route_optimization (string), general_tips (array).`;

    const userMessage = `Optimize the schedule for these pressure washing jobs:
- Location/Region: ${location || 'not specified'}
- Proposed Dates: ${Array.isArray(scheduled_dates) ? scheduled_dates.join(', ') : scheduled_dates || 'this week'}
- Services: ${Array.isArray(services) ? services.join(', ') : services || 'various'}
- Available Crews: ${crew_count || 1}
- Jobs Details: ${JSON.stringify(jobs || [])}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'weather-scheduling', 'generate', req.body, parsed);

    res.json({ success: true, schedule: parsed });
  } catch (err) {
    console.error('AI weather scheduling error:', err);
    res.status(500).json({ error: 'Failed to generate schedule optimization' });
  }
});

// ─── POST /api/ai/marketing-content ──────────────────────────────────────────

router.post('/marketing-content', auth, aiRateLimiter, async (req, res) => {
  try {
    const { content_type, service_performed, surface_type, before_description, after_description, target_audience, platform, tone } = req.body;

    const systemPrompt = `You are an expert marketing content creator for pressure washing businesses. Format response as JSON with keys: headline, body, hashtags (array), call_to_action, seo_keywords (array), suggested_posting_time, platform_specific_tips (string).`;

    const userMessage = `Create marketing content for this job:
- Content Type: ${content_type || 'social media post'}
- Service Performed: ${service_performed || 'pressure washing'}
- Surface Type: ${surface_type || 'not specified'}
- Before Description: ${before_description || 'dirty and stained'}
- After Description: ${after_description || 'clean and restored'}
- Target Audience: ${target_audience || 'homeowners'}
- Platform: ${platform || 'Facebook/Instagram'}
- Tone: ${tone || 'professional but friendly'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'marketing-content', 'generate', req.body, parsed);

    res.json({ success: true, content: parsed });
  } catch (err) {
    console.error('AI marketing content error:', err);
    res.status(500).json({ error: 'Failed to generate marketing content' });
  }
});

// ─── POST /api/ai/upsell-suggestions ─────────────────────────────────────────

router.post('/upsell-suggestions', auth, aiRateLimiter, async (req, res) => {
  try {
    const { customer_name, services_completed, property_type, property_details, last_service_date, customer_history } = req.body;

    const systemPrompt = `You are an expert pressure washing business consultant specializing in upselling. Format response as JSON with keys: upsell_suggestions (array of objects with service, benefit, timing, price_range, pitch_message, urgency), follow_up_schedule (array), loyalty_tips (array), referral_opportunity (string).`;

    const userMessage = `Suggest upsell opportunities for:
- Customer: ${customer_name || 'valued customer'}
- Services Completed: ${Array.isArray(services_completed) ? services_completed.join(', ') : services_completed || 'pressure washing'}
- Property Type: ${property_type || 'residential'}
- Property Details: ${property_details || 'standard home'}
- Last Service Date: ${last_service_date || 'recently'}
- Customer History: ${customer_history || 'first-time customer'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'upsell-suggestions', 'generate', req.body, parsed);

    res.json({ success: true, suggestions: parsed });
  } catch (err) {
    console.error('AI upsell suggestions error:', err);
    res.status(500).json({ error: 'Failed to generate upsell suggestions' });
  }
});

// ─── POST /api/ai/generate-quote ─────────────────────────────────────────────

router.post('/generate-quote', auth, aiRateLimiter, async (req, res) => {
  try {
    const { property_type, surface_area, contamination_level, location } = req.body;
    if (!property_type || !surface_area) {
      return res.status(400).json({ error: 'property_type and surface_area are required' });
    }

    const systemPrompt = `You are an expert pressure washing estimator. Generate an itemized quote with detailed line items. Return JSON with:
- line_items: array of { description, category, quantity, unit, unit_price, total }
- subtotal: number
- labor_total: number
- equipment_total: number
- materials_total: number
- markup_percent: number
- markup_amount: number
- total: number
- estimated_hours: number
- notes: array of strings`;

    const userMessage = `Generate an itemized quote for:
- Property Type: ${property_type}
- Surface Area: ${surface_area} sq ft
- Contamination Level: ${contamination_level || 'moderate'}
- Location: ${location || 'not specified'}

Include labor, equipment usage, materials/chemicals, and markup breakdown.`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'generate-quote', 'generate', req.body, parsed);

    res.json({ success: true, quote: parsed });
  } catch (err) {
    console.error('AI generate quote error:', err);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

// ─── POST /api/ai/optimize-routes ────────────────────────────────────────────

router.post('/optimize-routes', auth, aiRateLimiter, async (req, res) => {
  try {
    const { date, job_locations } = req.body;
    if (!job_locations || !Array.isArray(job_locations) || job_locations.length === 0) {
      return res.status(400).json({ error: 'job_locations array is required' });
    }

    const systemPrompt = `You are an expert route optimizer for field service businesses. Optimize job sequence to minimize drive time. Return JSON with:
- optimized_sequence: array of { job_id, job_address, position, estimated_arrival, estimated_duration, drive_time_from_previous }
- total_drive_time_minutes: number
- total_distance_estimate_miles: number
- efficiency_improvement_percent: number
- recommendations: array of strings
- summary: string`;

    const userMessage = `Optimize the job route for ${date || 'today'}:

Jobs to schedule: ${JSON.stringify(job_locations)}

Return the optimal sequence to minimize total drive time between jobs.`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'optimize-routes', 'generate', req.body, parsed);

    res.json({ success: true, route: parsed });
  } catch (err) {
    console.error('AI optimize routes error:', err);
    res.status(500).json({ error: 'Failed to optimize routes' });
  }
});

// ─── POST /api/ai/weather-schedule ───────────────────────────────────────────

router.post('/weather-schedule', auth, aiRateLimiter, async (req, res) => {
  try {
    const { job_list, date_range } = req.body;
    if (!job_list || !Array.isArray(job_list)) {
      return res.status(400).json({ error: 'job_list array is required' });
    }

    const systemPrompt = `You are a weather-aware scheduling expert for pressure washing businesses. Return JSON with:
- scheduling_recommendations: array of { job_id, job_address, recommended_date, time_window, weather_conditions, confidence, reason }
- avoid_dates: array of { date, reason, alternative }
- best_windows: array of { date_range, conditions, suitability_score }
- risk_flags: array of strings
- summary: string`;

    const userMessage = `Schedule these jobs avoiding bad weather (rain, freezing temps under 40F, high winds):

Jobs: ${JSON.stringify(job_list)}
Date Range: ${date_range || 'Next 14 days'}

Consider each job location for weather context and recommend optimal scheduling windows.`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'weather-schedule', 'generate', req.body, parsed);

    res.json({ success: true, schedule: parsed });
  } catch (err) {
    console.error('AI weather schedule error:', err);
    res.status(500).json({ error: 'Failed to generate weather schedule' });
  }
});

// ─── GET /api/ai/history ──────────────────────────────────────────────────────

router.get('/history', auth, async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_results (
        id SERIAL PRIMARY KEY, user_id INTEGER, feature VARCHAR(100), action VARCHAR(100),
        entity_type VARCHAR(100), entity_id INTEGER, input_data JSONB, output_data JSONB,
        model_used VARCHAR(100), created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const countRes = await pool.query('SELECT COUNT(*) FROM ai_results');
    const total = parseInt(countRes.rows[0].count);

    const result = await pool.query(
      `SELECT id, user_id, feature, action, model_used, created_at FROM ai_results ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('AI history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/ai/equipment-maintenance-predict ──────────────────────────────
router.post('/equipment-maintenance-predict', auth, aiRateLimiter, async (req, res) => {
  try {
    const { equipment_id } = req.body;

    let equipment = [];
    try {
      const params = equipment_id ? [equipment_id] : [];
      const where = equipment_id ? 'WHERE id = $1' : '';
      const r = await pool.query(
        `SELECT id, name, type, hours_used, last_serviced_at, purchase_date, status
         FROM equipment ${where}
         ORDER BY hours_used DESC NULLS LAST
         LIMIT 100`,
        params
      );
      equipment = r.rows;
    } catch (_) {}

    const summary = equipment.map(e =>
      `id=${e.id} name=${e.name} type=${e.type || ''} hours=${e.hours_used || 0} last_service=${e.last_serviced_at || 'n/a'} purchased=${e.purchase_date || 'n/a'} status=${e.status || ''}`
    ).join('\n');

    const systemPrompt = `You are a pressure-washing equipment maintenance planner. Predict next-service windows and flag at-risk units. Return ONLY valid JSON matching:
{
  "predictions": [{"equipment_id": 0, "next_service_in_days": 0, "next_service_in_hours": 0, "service_type": "string", "priority": "low|medium|high|critical", "estimated_cost_usd": 0, "reason": "string"}],
  "at_risk": [{"equipment_id": 0, "risk": "string", "action": "string"}],
  "summary": "string"
}`;
    const userMessage = `Equipment fleet:\n${summary || 'None'}\n\nReturn JSON only.`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);

    try {
      await pool.query(
        `INSERT INTO ai_results (user_id, feature, action, entity_type, entity_id, input_data, output_data, model_used)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [req.user?.id || null, 'equipment-maintenance-predict', 'predict', 'equipment', equipment_id || null, JSON.stringify({ equipment_id }), JSON.stringify({ raw: aiResponse }), process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5']
      );
    } catch (_) {}

    res.json({ success: true, data: { equipment_analyzed: equipment.length, analysis: aiResponse } });
  } catch (err) {
    console.error('equipment-maintenance-predict error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/ai/customer-churn-predict ──────────────────────────────────────
router.post('/customer-churn-predict', auth, aiRateLimiter, async (req, res) => {
  try {
    let customers = [];
    try {
      const r = await pool.query(
        `SELECT c.id, c.name, c.created_at,
                (SELECT MAX(scheduled_at) FROM bookings b WHERE b.customer_id = c.id) AS last_booking,
                (SELECT COUNT(*) FROM bookings b WHERE b.customer_id = c.id) AS total_bookings,
                (SELECT AVG(rating) FROM reviews r WHERE r.customer_id = c.id) AS avg_rating
         FROM customers c
         ORDER BY c.created_at DESC
         LIMIT 200`
      );
      customers = r.rows;
    } catch (_) {
      try {
        const r = await pool.query('SELECT id, name, created_at FROM customers ORDER BY created_at DESC LIMIT 200');
        customers = r.rows;
      } catch (__) {}
    }

    const summary = customers.map(c =>
      `id=${c.id} name=${c.name} acq=${c.created_at} last_booking=${c.last_booking || 'never'} bookings=${c.total_bookings || 0} avg_rating=${c.avg_rating || 'n/a'}`
    ).join('\n');

    const systemPrompt = `You are a customer-retention AI for a pressure-washing service. Identify likely churners (no recent booking, low rating, declining frequency) and recommend outreach. Return ONLY valid JSON matching:
{
  "at_risk_customers": [{"customer_id": 0, "name": "string", "churn_score": 0, "evidence": ["string"], "recommended_outreach": "string", "offer_idea": "string"}],
  "stable_customers": [0],
  "outreach_priority_count": 0,
  "summary": "string"
}`;
    const userMessage = `Customers:\n${summary || 'None'}\n\nReturn JSON only.`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);

    try {
      await pool.query(
        `INSERT INTO ai_results (user_id, feature, action, entity_type, entity_id, input_data, output_data, model_used)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [req.user?.id || null, 'customer-churn-predict', 'predict', 'customers', null, JSON.stringify({}), JSON.stringify({ raw: aiResponse }), process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5']
      );
    } catch (_) {}

    res.json({ success: true, data: { customers_analyzed: customers.length, analysis: aiResponse } });
  } catch (err) {
    console.error('customer-churn-predict error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/ai (feature list) ───────────────────────────────────────────────

router.get('/', auth, async (req, res) => {
  res.json({
    success: true,
    data: [
      { endpoint: 'quote-estimate', description: 'Instant quote estimation from property details' },
      { endpoint: 'chemical-recommendation', description: 'Chemical mix recommendations by surface type' },
      { endpoint: 'weather-scheduling', description: 'Weather-based scheduling optimization' },
      { endpoint: 'marketing-content', description: 'Before/after marketing content generation' },
      { endpoint: 'upsell-suggestions', description: 'Customer follow-up upsell suggestions' },
      { endpoint: 'generate-quote', description: 'Itemized quote generator with labor/equipment/materials' },
      { endpoint: 'optimize-routes', description: 'Route optimizer for job sequence' },
      { endpoint: 'weather-schedule', description: 'Weather-aware job scheduler' },
      { endpoint: 'equipment-maintenance-predict', description: 'Predict equipment service needs' },
      { endpoint: 'customer-churn-predict', description: 'Identify customers likely to churn' },
    ],
  });
});

module.exports = router;
