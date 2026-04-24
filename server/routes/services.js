const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('List services error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get service error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/services
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category, base_price, price_unit, estimated_duration, surface_types } = req.body;
    const result = await pool.query(
      `INSERT INTO services (name, description, category, base_price, price_unit, estimated_duration, surface_types)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, category, base_price, price_unit, estimated_duration, surface_types]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create service error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/services/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, category, base_price, price_unit, estimated_duration, surface_types } = req.body;
    const result = await pool.query(
      `UPDATE services SET name=$1, description=$2, category=$3, base_price=$4, price_unit=$5,
       estimated_duration=$6, surface_types=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
      [name, description, category, base_price, price_unit, estimated_duration, surface_types, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update service error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/services/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error('Delete service error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
