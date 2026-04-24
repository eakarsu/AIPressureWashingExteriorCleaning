const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/service-plans
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sp.*, c.name as customer_name, p.address as property_address
       FROM service_plans sp
       LEFT JOIN customers c ON sp.customer_id = c.id
       LEFT JOIN properties p ON sp.property_id = p.id
       ORDER BY sp.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List service plans error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/service-plans/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM service_plans WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service plan not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get service plan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/service-plans
router.post('/', auth, async (req, res) => {
  try {
    const { customer_id, property_id, name, service_ids, frequency, start_date, end_date, price_per_visit, total_visits, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO service_plans (customer_id, property_id, name, service_ids, frequency, start_date, end_date, price_per_visit, total_visits, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [customer_id, property_id, name, JSON.stringify(service_ids), frequency, start_date, end_date, price_per_visit, total_visits, status || 'active', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create service plan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/service-plans/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { customer_id, property_id, name, service_ids, frequency, start_date, end_date, price_per_visit, total_visits, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE service_plans SET customer_id=$1, property_id=$2, name=$3, service_ids=$4, frequency=$5,
       start_date=$6, end_date=$7, price_per_visit=$8, total_visits=$9, status=$10, notes=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [customer_id, property_id, name, JSON.stringify(service_ids), frequency, start_date, end_date, price_per_visit, total_visits, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service plan not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update service plan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/service-plans/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM service_plans WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service plan not found' });
    res.json({ message: 'Service plan deleted' });
  } catch (err) {
    console.error('Delete service plan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
