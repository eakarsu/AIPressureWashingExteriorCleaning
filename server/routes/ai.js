const router = require('express').Router();
const auth = require('../middleware/auth');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter(systemPrompt, userMessage) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3001',
      'X-Title': 'AI Pressure Washing & Exterior Cleaning'
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// POST /api/ai/quote-estimate - Instant quote estimation
router.post('/quote-estimate', auth, async (req, res) => {
  try {
    const { property_type, square_footage, services, surface_type, condition, num_stories, additional_details } = req.body;

    const systemPrompt = `You are an expert pressure washing and exterior cleaning estimator with 20+ years of industry experience. You provide accurate, detailed cost estimates for pressure washing and exterior cleaning jobs.

Your estimates should account for:
- Surface type and condition (concrete, wood, vinyl, brick, stucco, etc.)
- Square footage and property size
- Number of stories (affects equipment and labor needs)
- Required chemicals and their costs
- Labor hours based on crew size
- Equipment wear and fuel costs
- Travel and setup time
- Seasonal pricing adjustments
- Profit margins (typically 40-60% for pressure washing)

Provide a detailed breakdown with:
1. Estimated total price range (low and high)
2. Line-item breakdown (labor, chemicals, equipment, overhead)
3. Estimated time to complete
4. Recommended crew size
5. Special considerations or notes

Format your response as JSON with keys: estimated_low, estimated_high, line_items (array), estimated_hours, recommended_crew_size, special_notes (array).`;

    const userMessage = `Please estimate the cost for this pressure washing job:
- Property Type: ${property_type || 'residential'}
- Square Footage: ${square_footage || 'unknown'}
- Services Requested: ${Array.isArray(services) ? services.join(', ') : services || 'general pressure washing'}
- Surface Type: ${surface_type || 'not specified'}
- Surface Condition: ${condition || 'average'}
- Number of Stories: ${num_stories || 1}
- Additional Details: ${additional_details || 'none'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    res.json({ estimate: aiResponse });
  } catch (err) {
    console.error('AI quote estimate error:', err);
    res.status(500).json({ error: 'Failed to generate quote estimate' });
  }
});

// POST /api/ai/chemical-recommendation - Chemical mix recommendations
router.post('/chemical-recommendation', auth, async (req, res) => {
  try {
    const { surface_type, stain_type, condition, area_sqft, environmental_concerns } = req.body;

    const systemPrompt = `You are an expert in pressure washing chemicals and cleaning solutions with deep knowledge of exterior cleaning chemistry. You specialize in recommending the right chemical mixes for different surfaces and stain types in the pressure washing industry.

Your knowledge includes:
- Sodium hypochlorite (bleach) concentrations and applications
- Surfactants (e.g., Elemonator, SH proportioner mixes)
- Sodium hydroxide for degreasing
- Oxalic acid for rust removal
- Potassium hydroxide solutions
- Soft wash chemical ratios (house wash, roof wash)
- Hot water vs cold water applications
- Downstream vs upstream injection ratios
- Environmental and safety considerations
- EPA and local regulation compliance

Provide recommendations with:
1. Primary chemical mix with exact ratios
2. Application method (downstream, X-jet, soft wash, direct apply)
3. Dwell time
4. Rinse procedure
5. Safety precautions (PPE required)
6. Environmental considerations
7. Surface-safe verification

Format your response as JSON with keys: primary_mix (object with chemicals and ratios), application_method, dwell_time_minutes, rinse_procedure, safety_precautions (array), environmental_notes (array), warnings (array).`;

    const userMessage = `Recommend the best chemical mix for this cleaning job:
- Surface Type: ${surface_type || 'not specified'}
- Stain/Dirt Type: ${stain_type || 'general grime'}
- Surface Condition: ${condition || 'moderate'}
- Area Size: ${area_sqft || 'unknown'} sq ft
- Environmental Concerns: ${environmental_concerns || 'none specified'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    res.json({ recommendation: aiResponse });
  } catch (err) {
    console.error('AI chemical recommendation error:', err);
    res.status(500).json({ error: 'Failed to generate chemical recommendation' });
  }
});

// POST /api/ai/weather-scheduling - Weather-based scheduling optimization
router.post('/weather-scheduling', auth, async (req, res) => {
  try {
    const { location, scheduled_dates, services, crew_count, jobs } = req.body;

    const systemPrompt = `You are an expert pressure washing business scheduler who optimizes job scheduling based on weather conditions and operational efficiency. You understand how weather affects pressure washing work.

Key weather considerations for pressure washing:
- Rain: Cannot pressure wash during rain; surfaces need to be dry for chemical treatment
- Temperature: Below 40F risks freezing damage; above 95F causes rapid chemical evaporation
- Wind: Above 15mph affects spray pattern and chemical drift
- Humidity: High humidity extends drying time; affects soft wash results
- UV/Sun: Direct sun causes chemical streaking on hot surfaces
- Frost: Morning frost delays start times
- Upcoming rain: Can actually be beneficial for pre-treatment rinsing

Scheduling optimization factors:
- Route efficiency (minimize drive time between jobs)
- Job grouping by area/neighborhood
- Chemical application timing (early morning for best results)
- Customer preference windows
- Crew availability and skill matching
- Equipment requirements per job

Provide recommendations with:
1. Optimal scheduling order
2. Weather-based timing recommendations
3. Jobs to reschedule with reasons
4. Best time windows for each job
5. Route optimization suggestions

Format your response as JSON with keys: schedule_recommendations (array of objects), reschedule_suggestions (array), weather_alerts (array), route_optimization (string), general_tips (array).`;

    const userMessage = `Optimize the schedule for these pressure washing jobs:
- Location/Region: ${location || 'not specified'}
- Proposed Dates: ${Array.isArray(scheduled_dates) ? scheduled_dates.join(', ') : scheduled_dates || 'this week'}
- Services: ${Array.isArray(services) ? services.join(', ') : services || 'various'}
- Available Crews: ${crew_count || 1}
- Jobs Details: ${JSON.stringify(jobs) || 'not specified'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    res.json({ schedule: aiResponse });
  } catch (err) {
    console.error('AI weather scheduling error:', err);
    res.status(500).json({ error: 'Failed to generate schedule optimization' });
  }
});

// POST /api/ai/marketing-content - Before/after marketing content generation
router.post('/marketing-content', auth, async (req, res) => {
  try {
    const { content_type, service_performed, surface_type, before_description, after_description, target_audience, platform, tone } = req.body;

    const systemPrompt = `You are an expert marketing content creator specializing in pressure washing and exterior cleaning businesses. You create compelling before/after content that drives customer engagement and bookings.

Your expertise includes:
- Social media posts (Facebook, Instagram, NextDoor, Google Business)
- Email marketing campaigns
- Before/after photo captions that tell a transformation story
- SEO-optimized website content
- Google Business posts
- Customer testimonial frameworks
- Seasonal marketing campaigns
- Local SEO content
- Video script outlines for transformation videos
- Hashtag strategies for pressure washing content

Content principles:
- Show dramatic transformation results
- Include specific details (PSI used, time taken, square footage)
- Use emotional triggers (pride in home, curb appeal, property value)
- Include clear calls to action
- Highlight safety and professionalism
- Mention eco-friendly practices when applicable
- Use local area references for community connection

Format your response as JSON with keys: headline, body, hashtags (array), call_to_action, seo_keywords (array), suggested_posting_time, platform_specific_tips (string).`;

    const userMessage = `Create marketing content for this pressure washing job:
- Content Type: ${content_type || 'social media post'}
- Service Performed: ${service_performed || 'pressure washing'}
- Surface Type: ${surface_type || 'not specified'}
- Before Description: ${before_description || 'dirty and stained'}
- After Description: ${after_description || 'clean and restored'}
- Target Audience: ${target_audience || 'homeowners'}
- Platform: ${platform || 'Facebook/Instagram'}
- Tone: ${tone || 'professional but friendly'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    res.json({ content: aiResponse });
  } catch (err) {
    console.error('AI marketing content error:', err);
    res.status(500).json({ error: 'Failed to generate marketing content' });
  }
});

// POST /api/ai/upsell-suggestions - Customer follow-up upsell suggestions
router.post('/upsell-suggestions', auth, async (req, res) => {
  try {
    const { customer_name, services_completed, property_type, property_details, last_service_date, customer_history } = req.body;

    const systemPrompt = `You are an expert pressure washing business consultant who specializes in customer retention and upselling strategies. You help pressure washing companies increase revenue through smart follow-up recommendations.

Your knowledge includes:
- Complementary service bundles (e.g., driveway wash + sidewalk + gutter cleaning)
- Seasonal upsell opportunities (spring house wash, fall gutter cleaning, winter prep)
- Recurring service plan recommendations
- Property-specific maintenance schedules
- Cross-selling exterior services (window cleaning, gutter guards, sealing)
- Customer lifecycle optimization
- Loyalty program suggestions
- Referral incentive ideas
- Timing-based follow-ups (30/60/90 day cycles)

For each upsell suggestion provide:
1. Specific service recommendation
2. Why it benefits the customer
3. Suggested timing
4. Estimated pricing range
5. Personalized pitch message
6. Urgency factors (seasonal, weather damage prevention)

Format your response as JSON with keys: upsell_suggestions (array of objects with service, benefit, timing, price_range, pitch_message, urgency), follow_up_schedule (array), loyalty_tips (array), referral_opportunity (string).`;

    const userMessage = `Suggest upsell opportunities for this customer:
- Customer: ${customer_name || 'valued customer'}
- Services Completed: ${Array.isArray(services_completed) ? services_completed.join(', ') : services_completed || 'pressure washing'}
- Property Type: ${property_type || 'residential'}
- Property Details: ${property_details || 'standard home'}
- Last Service Date: ${last_service_date || 'recently'}
- Customer History: ${customer_history || 'first-time customer'}`;

    const aiResponse = await callOpenRouter(systemPrompt, userMessage);
    res.json({ suggestions: aiResponse });
  } catch (err) {
    console.error('AI upsell suggestions error:', err);
    res.status(500).json({ error: 'Failed to generate upsell suggestions' });
  }
});

// Standard CRUD endpoints for AI logs/history

// GET /api/ai - List AI interaction history
router.get('/', auth, async (req, res) => {
  try {
    res.json([
      { endpoint: 'quote-estimate', description: 'Instant quote estimation from property details' },
      { endpoint: 'chemical-recommendation', description: 'Chemical mix recommendations by surface type' },
      { endpoint: 'weather-scheduling', description: 'Weather-based scheduling optimization' },
      { endpoint: 'marketing-content', description: 'Before/after marketing content generation' },
      { endpoint: 'upsell-suggestions', description: 'Customer follow-up upsell suggestions' }
    ]);
  } catch (err) {
    console.error('List AI features error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/ai/:id
router.get('/:id', auth, async (req, res) => {
  const features = {
    'quote-estimate': { name: 'Quote Estimate', method: 'POST', description: 'Generate instant cost estimates from property square footage and details' },
    'chemical-recommendation': { name: 'Chemical Recommendation', method: 'POST', description: 'Get chemical mix recommendations based on surface type and condition' },
    'weather-scheduling': { name: 'Weather Scheduling', method: 'POST', description: 'Optimize job scheduling based on weather conditions' },
    'marketing-content': { name: 'Marketing Content', method: 'POST', description: 'Generate before/after marketing content for social media' },
    'upsell-suggestions': { name: 'Upsell Suggestions', method: 'POST', description: 'Get personalized upsell recommendations for customers' }
  };
  const feature = features[req.params.id];
  if (!feature) return res.status(404).json({ error: 'AI feature not found' });
  res.json(feature);
});

// PUT /api/ai/:id - Not applicable
router.put('/:id', auth, async (req, res) => {
  res.status(405).json({ error: 'AI features cannot be updated via PUT' });
});

// DELETE /api/ai/:id - Not applicable
router.delete('/:id', auth, async (req, res) => {
  res.status(405).json({ error: 'AI features cannot be deleted' });
});

module.exports = router;
