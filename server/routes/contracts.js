const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/contracts
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ct.*, c.name as customer_name
       FROM contracts ct
       LEFT JOIN customers c ON ct.customer_id = c.id
       ORDER BY ct.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List contracts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/contracts/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ct.*, c.name as customer_name
       FROM contracts ct
       LEFT JOIN customers c ON ct.customer_id = c.id
       WHERE ct.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get contract error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/contracts
router.post('/', auth, async (req, res) => {
  try {
    const { customer_id, title, description, service_ids, start_date, end_date, total_value, payment_terms, frequency, status, document_url, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO contracts (customer_id, title, description, service_ids, start_date, end_date, total_value, payment_terms, frequency, status, document_url, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [customer_id, title, description, JSON.stringify(service_ids), start_date, end_date, total_value, payment_terms, frequency, status || 'draft', document_url, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create contract error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/contracts/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { customer_id, title, description, service_ids, start_date, end_date, total_value, payment_terms, frequency, status, document_url, notes } = req.body;
    const result = await pool.query(
      `UPDATE contracts SET customer_id=$1, title=$2, description=$3, service_ids=$4, start_date=$5,
       end_date=$6, total_value=$7, payment_terms=$8, frequency=$9, status=$10, document_url=$11,
       notes=$12, updated_at=NOW() WHERE id=$13 RETURNING *`,
      [customer_id, title, description, JSON.stringify(service_ids), start_date, end_date, total_value, payment_terms, frequency, status, document_url, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update contract error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/contracts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contracts WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Contract not found' });
    res.json({ message: 'Contract deleted' });
  } catch (err) {
    console.error('Delete contract error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
