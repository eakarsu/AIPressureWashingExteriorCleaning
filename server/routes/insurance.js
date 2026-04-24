const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/insurance
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insurance_certificates ORDER BY expiry_date ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('List insurance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/insurance/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insurance_certificates WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Insurance certificate not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get insurance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/insurance
router.post('/', auth, async (req, res) => {
  try {
    const { type, provider, policy_number, coverage_amount, premium, start_date, expiry_date, document_url, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO insurance_certificates (type, provider, policy_number, coverage_amount, premium, start_date, expiry_date, document_url, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [type, provider, policy_number, coverage_amount, premium, start_date, expiry_date, document_url, status || 'active', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create insurance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/insurance/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, provider, policy_number, coverage_amount, premium, start_date, expiry_date, document_url, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE insurance_certificates SET type=$1, provider=$2, policy_number=$3, coverage_amount=$4,
       premium=$5, start_date=$6, expiry_date=$7, document_url=$8, status=$9, notes=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [type, provider, policy_number, coverage_amount, premium, start_date, expiry_date, document_url, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Insurance certificate not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update insurance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/insurance/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM insurance_certificates WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Insurance certificate not found' });
    res.json({ message: 'Insurance certificate deleted' });
  } catch (err) {
    console.error('Delete insurance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
