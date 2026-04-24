const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/chemicals
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM chemicals ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('List chemicals error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/chemicals/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM chemicals WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Chemical not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get chemical error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/chemicals
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, manufacturer, concentration, unit, quantity_on_hand, reorder_level, cost_per_unit, sds_url, safe_surfaces, unsafe_surfaces, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO chemicals (name, type, manufacturer, concentration, unit, quantity_on_hand, reorder_level, cost_per_unit, sds_url, safe_surfaces, unsafe_surfaces, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name, type, manufacturer, concentration, unit, quantity_on_hand, reorder_level, cost_per_unit, sds_url, JSON.stringify(safe_surfaces), JSON.stringify(unsafe_surfaces), notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create chemical error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/chemicals/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, manufacturer, concentration, unit, quantity_on_hand, reorder_level, cost_per_unit, sds_url, safe_surfaces, unsafe_surfaces, notes } = req.body;
    const result = await pool.query(
      `UPDATE chemicals SET name=$1, type=$2, manufacturer=$3, concentration=$4, unit=$5,
       quantity_on_hand=$6, reorder_level=$7, cost_per_unit=$8, sds_url=$9, safe_surfaces=$10,
       unsafe_surfaces=$11, notes=$12, updated_at=NOW() WHERE id=$13 RETURNING *`,
      [name, type, manufacturer, concentration, unit, quantity_on_hand, reorder_level, cost_per_unit, sds_url, JSON.stringify(safe_surfaces), JSON.stringify(unsafe_surfaces), notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Chemical not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update chemical error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/chemicals/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM chemicals WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Chemical not found' });
    res.json({ message: 'Chemical deleted' });
  } catch (err) {
    console.error('Delete chemical error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
