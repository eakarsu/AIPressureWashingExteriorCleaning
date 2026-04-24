const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/jobs
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name as customer_name, p.address as property_address
       FROM jobs j
       LEFT JOIN customers c ON j.customer_id = c.id
       LEFT JOIN properties p ON j.property_id = p.id
       ORDER BY j.scheduled_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List jobs error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/jobs/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, c.name as customer_name, p.address as property_address
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

// POST /api/jobs
router.post('/', auth, async (req, res) => {
  try {
    const { customer_id, property_id, quote_id, crew_id, service_ids, scheduled_date, scheduled_time, estimated_duration, status, priority, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO jobs (customer_id, property_id, quote_id, crew_id, service_ids, scheduled_date, scheduled_time, estimated_duration, status, priority, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [customer_id, property_id, quote_id, crew_id, JSON.stringify(service_ids), scheduled_date, scheduled_time, estimated_duration, status || 'scheduled', priority || 'normal', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/jobs/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { customer_id, property_id, quote_id, crew_id, service_ids, scheduled_date, scheduled_time, estimated_duration, status, priority, notes, actual_duration, completed_at } = req.body;
    const result = await pool.query(
      `UPDATE jobs SET customer_id=$1, property_id=$2, quote_id=$3, crew_id=$4, service_ids=$5,
       scheduled_date=$6, scheduled_time=$7, estimated_duration=$8, status=$9, priority=$10, notes=$11,
       actual_duration=$12, completed_at=$13, updated_at=NOW() WHERE id=$14 RETURNING *`,
      [customer_id, property_id, quote_id, crew_id, JSON.stringify(service_ids), scheduled_date, scheduled_time, estimated_duration, status, priority, notes, actual_duration, completed_at, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/jobs/:id
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

module.exports = router;
