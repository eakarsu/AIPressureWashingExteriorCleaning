const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/marketing
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marketing_campaigns ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('List marketing error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/marketing/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marketing_campaigns WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get marketing error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/marketing
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, channel, target_audience, start_date, end_date, budget, content, status, metrics, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO marketing_campaigns (name, type, channel, target_audience, start_date, end_date, budget, content, status, metrics, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name, type, channel, target_audience, start_date, end_date, budget, content, status || 'draft', JSON.stringify(metrics), notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create marketing error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/marketing/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, channel, target_audience, start_date, end_date, budget, content, status, metrics, notes } = req.body;
    const result = await pool.query(
      `UPDATE marketing_campaigns SET name=$1, type=$2, channel=$3, target_audience=$4, start_date=$5,
       end_date=$6, budget=$7, content=$8, status=$9, metrics=$10, notes=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [name, type, channel, target_audience, start_date, end_date, budget, content, status, JSON.stringify(metrics), notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update marketing error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/marketing/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM marketing_campaigns WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    console.error('Delete marketing error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
