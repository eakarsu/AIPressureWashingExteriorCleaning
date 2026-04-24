const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/training
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM training_records ORDER BY training_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('List training error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/training/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM training_records WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Training record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get training error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/training
router.post('/', auth, async (req, res) => {
  try {
    const { employee_name, crew_id, training_type, title, description, training_date, expiry_date, trainer, certificate_url, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO training_records (employee_name, crew_id, training_type, title, description, training_date, expiry_date, trainer, certificate_url, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [employee_name, crew_id, training_type, title, description, training_date, expiry_date, trainer, certificate_url, status || 'completed', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create training error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/training/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { employee_name, crew_id, training_type, title, description, training_date, expiry_date, trainer, certificate_url, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE training_records SET employee_name=$1, crew_id=$2, training_type=$3, title=$4, description=$5,
       training_date=$6, expiry_date=$7, trainer=$8, certificate_url=$9, status=$10, notes=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [employee_name, crew_id, training_type, title, description, training_date, expiry_date, trainer, certificate_url, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Training record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update training error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/training/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM training_records WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Training record not found' });
    res.json({ message: 'Training record deleted' });
  } catch (err) {
    console.error('Delete training error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
