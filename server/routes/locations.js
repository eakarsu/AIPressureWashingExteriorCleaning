const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/locations
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('List locations error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/locations/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Location not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get location error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/locations
router.post('/', auth, async (req, res) => {
  try {
    const { name, address, city, state, zip, phone, email, manager_name, service_area_radius, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO locations (name, address, city, state, zip, phone, email, manager_name, service_area_radius, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name, address, city, state, zip, phone, email, manager_name, service_area_radius, status || 'active', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create location error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/locations/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, address, city, state, zip, phone, email, manager_name, service_area_radius, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE locations SET name=$1, address=$2, city=$3, state=$4, zip=$5, phone=$6, email=$7,
       manager_name=$8, service_area_radius=$9, status=$10, notes=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [name, address, city, state, zip, phone, email, manager_name, service_area_radius, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Location not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update location error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/locations/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM locations WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Location not found' });
    res.json({ message: 'Location deleted' });
  } catch (err) {
    console.error('Delete location error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
