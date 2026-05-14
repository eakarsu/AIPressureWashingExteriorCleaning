const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// ─── Multer config ───────────────────────────────────────────────────────────

const uploadDir = path.join(__dirname, '../../uploads/jobs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `job-${req.params.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseAIJson(text) {
  try { const m = text.match(/```(?:json)?\s*([\s\S]*?)```/); if (m) return JSON.parse(m[1].trim()); } catch (_) {}
  try { const m = text.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); } catch (_) {}
  try { return JSON.parse(text); } catch (_) {}
  return { raw_response: text };
}

async function callOpenRouter(systemPrompt, messages) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3001',
      'X-Title': 'AI Pressure Washing',
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 4000 }),
  });
  if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function saveAIResult(userId, feature, action, entityId, inputData, outputData) {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS ai_results (id SERIAL PRIMARY KEY, user_id INTEGER, feature VARCHAR(100), action VARCHAR(100), entity_type VARCHAR(100), entity_id INTEGER, input_data JSONB, output_data JSONB, model_used VARCHAR(100), created_at TIMESTAMP DEFAULT NOW())`);
    await pool.query(
      `INSERT INTO ai_results (user_id, feature, action, entity_type, entity_id, input_data, output_data, model_used) VALUES ($1,$2,$3,'job',$4,$5,$6,$7)`,
      [userId || null, feature, action, entityId || null, JSON.stringify(inputData), JSON.stringify(outputData), MODEL]
    );
  } catch (err) { console.error('saveAIResult error:', err.message); }
}

async function ensureJobPhotoColumns() {
  try {
    await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS before_photo_path TEXT`);
    await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS after_photo_path TEXT`);
    await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS surface_assessment JSONB`);
  } catch (err) { console.error('ensureJobPhotoColumns:', err.message); }
}

// ─── GET /api/jobs ────────────────────────────────────────────────────────────

router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const countRes = await pool.query('SELECT COUNT(*) FROM jobs');
    const total = parseInt(countRes.rows[0].count);

    const result = await pool.query(
      `SELECT j.*,
              CONCAT(c.first_name, ' ', c.last_name) as customer_name,
              CONCAT(p.address_line1, ', ', p.city, ', ', p.state) as property_address
       FROM jobs j
       LEFT JOIN customers c ON j.customer_id = c.id
       LEFT JOIN properties p ON j.property_id = p.id
       ORDER BY j.scheduled_date DESC NULLS LAST
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      data: result.rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('List jobs error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/jobs/:id ────────────────────────────────────────────────────────

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*,
              CONCAT(c.first_name, ' ', c.last_name) as customer_name,
              CONCAT(p.address_line1, ', ', p.city, ', ', p.state) as property_address
       FROM jobs j
       LEFT JOIN customers c ON j.customer_id = c.id
       LEFT JOIN properties p ON j.property_id = p.id
       WHERE j.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get job error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/jobs ───────────────────────────────────────────────────────────

router.post('/', auth, async (req, res) => {
  try {
    const body = req.body;
    const entries = Object.entries(body).filter(([k, v]) => v !== undefined && v !== '' && k !== 'id');
    if (entries.length === 0) return res.status(400).json({ error: 'No data provided' });
    const keys = entries.map(([k]) => k);
    const values = entries.map(([, v]) => v);
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const result = await pool.query(
      `INSERT INTO jobs (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// ─── PUT /api/jobs/:id ────────────────────────────────────────────────────────

router.put('/:id', auth, async (req, res) => {
  try {
    const body = req.body;
    const entries = Object.entries(body).filter(([k, v]) => v !== undefined && k !== 'id' && k !== 'created_at');
    if (entries.length === 0) return res.status(400).json({ error: 'No data provided' });
    const setClauses = entries.map(([k], i) => `${k} = $${i + 1}`);
    const values = entries.map(([, v]) => v === '' ? null : v);
    setClauses.push('updated_at = NOW()');
    const result = await pool.query(
      `UPDATE jobs SET ${setClauses.join(', ')} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// ─── DELETE /api/jobs/:id ─────────────────────────────────────────────────────

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/jobs/:id/upload-before ─────────────────────────────────────────

router.post('/:id/upload-before', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    await ensureJobPhotoColumns();
    const filePath = `/uploads/jobs/${req.file.filename}`;

    const result = await pool.query(
      `UPDATE jobs SET before_photo_path = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [filePath, req.params.id]
    );
    if (result.rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Job not found' });
    }

    // Also insert into photos table
    await pool.query(
      `INSERT INTO photos (job_id, uploaded_by, photo_type, url, taken_at) VALUES ($1, $2, 'before', $3, NOW())`,
      [req.params.id, req.user?.id, filePath]
    );

    res.json({ success: true, photo_path: filePath, job: result.rows[0] });
  } catch (err) {
    console.error('Upload before photo error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// ─── POST /api/jobs/:id/upload-after ──────────────────────────────────────────

router.post('/:id/upload-after', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    await ensureJobPhotoColumns();
    const filePath = `/uploads/jobs/${req.file.filename}`;

    const result = await pool.query(
      `UPDATE jobs SET after_photo_path = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [filePath, req.params.id]
    );
    if (result.rows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Job not found' });
    }

    await pool.query(
      `INSERT INTO photos (job_id, uploaded_by, photo_type, url, taken_at) VALUES ($1, $2, 'after', $3, NOW())`,
      [req.params.id, req.user?.id, filePath]
    );

    res.json({ success: true, photo_path: filePath, job: result.rows[0] });
  } catch (err) {
    console.error('Upload after photo error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// ─── POST /api/jobs/:id/ai-surface-assess ────────────────────────────────────

router.post('/:id/ai-surface-assess', auth, aiRateLimiter, async (req, res) => {
  try {
    await ensureJobPhotoColumns();
    const jobId = parseInt(req.params.id);

    const jobRes = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (jobRes.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    const job = jobRes.rows[0];

    let imageBase64 = null;
    if (job.before_photo_path) {
      try {
        const absPath = path.join(__dirname, '../..', job.before_photo_path);
        if (fs.existsSync(absPath)) {
          const imageBuffer = fs.readFileSync(absPath);
          imageBase64 = imageBuffer.toString('base64');
        }
      } catch (e) { console.error('Could not read image:', e.message); }
    }

    const systemPrompt = `You are an expert exterior surface assessment AI for pressure washing services. Analyze the surface image and job details to provide a comprehensive assessment. Return JSON with:
- surface_type: string (concrete/brick/wood/vinyl/stucco/etc)
- contamination_level: "light"|"moderate"|"heavy"|"severe"
- contamination_types: array of strings (mold, mildew, oil, rust, algae, etc)
- recommended_pressure_psi: number
- recommended_detergent: string
- estimated_hours: number
- safety_concerns: array of strings
- special_techniques: array of strings
- confidence: number 0-100`;

    let messages;
    if (imageBase64) {
      messages = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Assess this surface for pressure washing. Job details: ${JSON.stringify({ status: job.status, notes: job.notes, total_sqft: job.total_sqft })}` },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
          ],
        },
      ];
    } else {
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Assess this job for pressure washing (no photo available). Job details: ${JSON.stringify(job)}. Provide assessment based on job information.` },
      ];
    }

    const aiResponse = await callOpenRouter(systemPrompt, messages.slice(1).map(m => typeof m.content === 'string' ? m : { ...m, content: Array.isArray(m.content) ? m.content.find(c => c.type === 'text').text : m.content }));
    const parsed = parseAIJson(aiResponse);

    // Save assessment to job
    await pool.query(`UPDATE jobs SET surface_assessment = $1, updated_at = NOW() WHERE id = $2`, [JSON.stringify(parsed), jobId]);
    await saveAIResult(req.user?.id, 'surface-assessment', 'assess', jobId, { job_id: jobId, has_photo: !!imageBase64 }, parsed);

    res.json({ success: true, assessment: parsed, has_photo: !!imageBase64 });
  } catch (err) {
    console.error('Surface assess error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// ─── POST /api/jobs/:id/generate-followup ─────────────────────────────────────

router.post('/:id/generate-followup', auth, aiRateLimiter, async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    await ensureJobPhotoColumns();

    const jobRes = await pool.query(
      `SELECT j.*,
              CONCAT(c.first_name, ' ', c.last_name) as customer_name,
              c.email as customer_email,
              CONCAT(p.address_line1, ', ', p.city) as property_address,
              s.name as service_name
       FROM jobs j
       LEFT JOIN customers c ON j.customer_id = c.id
       LEFT JOIN properties p ON j.property_id = p.id
       LEFT JOIN services s ON j.service_id = s.id
       WHERE j.id = $1`,
      [jobId]
    );
    if (jobRes.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    const job = jobRes.rows[0];

    const hasBeforePhoto = !!job.before_photo_path;
    const hasAfterPhoto = !!job.after_photo_path;

    const systemPrompt = `You are an expert customer relations specialist for a pressure washing business. Generate a personalized follow-up email after job completion. Return JSON with:
- subject: string
- greeting: string
- before_after_summary: string
- care_tips: array of strings
- rebooking_offer: string
- closing: string
- full_email_body: string`;

    const userMessage = `Generate a follow-up email for this completed job:
- Customer: ${job.customer_name}
- Service: ${job.service_name || 'pressure washing'}
- Property: ${job.property_address}
- Completion Date: ${job.actual_end || job.scheduled_date || 'recently'}
- Has Before Photo: ${hasBeforePhoto}
- Has After Photo: ${hasAfterPhoto}
- Completion Notes: ${job.completion_notes || 'Job completed successfully'}
- Amount: $${job.amount || 'N/A'}`;

    const aiResponse = await callOpenRouter(systemPrompt, [{ role: 'user', content: userMessage }]);
    const parsed = parseAIJson(aiResponse);

    await saveAIResult(req.user?.id, 'generate-followup', 'generate', jobId, { job_id: jobId }, parsed);

    res.json({ success: true, email: parsed, customer_email: job.customer_email });
  } catch (err) {
    console.error('Generate followup error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;
