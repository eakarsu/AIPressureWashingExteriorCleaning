const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/crews
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM crews ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('List crews error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/crews/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM crews WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Crew not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get crew error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/crews
router.post('/', auth, async (req, res) => {
  try {
    const { name, leader_name, members, phone, email, specialties, status } = req.body;
    const result = await pool.query(
      `INSERT INTO crews (name, leader_name, members, phone, email, specialties, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, leader_name, JSON.stringify(members), phone, email, JSON.stringify(specialties), status || 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create crew error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/crews/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, leader_name, members, phone, email, specialties, status } = req.body;
    const result = await pool.query(
      `UPDATE crews SET name=$1, leader_name=$2, members=$3, phone=$4, email=$5, specialties=$6,
       status=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
      [name, leader_name, JSON.stringify(members), phone, email, JSON.stringify(specialties), status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Crew not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update crew error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/crews/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM crews WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Crew not found' });
    res.json({ message: 'Crew deleted' });
  } catch (err) {
    console.error('Delete crew error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
