const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, c.name as customer_name, j.scheduled_date as job_date
       FROM reviews r
       LEFT JOIN customers c ON r.customer_id = c.id
       LEFT JOIN jobs j ON r.job_id = j.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List reviews error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reviews/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Review not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get review error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reviews
router.post('/', async (req, res) => {
  try {
    const { customer_id, job_id, rating, title, comment, source, is_public, response } = req.body;
    const result = await pool.query(
      `INSERT INTO reviews (customer_id, job_id, rating, title, comment, source, is_public, response)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [customer_id, job_id, rating, title, comment, source || 'website', is_public !== false, response]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/reviews/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, title, comment, source, is_public, response } = req.body;
    const result = await pool.query(
      `UPDATE reviews SET rating=$1, title=$2, comment=$3, source=$4, is_public=$5, response=$6,
       updated_at=NOW() WHERE id=$7 RETURNING *`,
      [rating, title, comment, source, is_public, response, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Review not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
