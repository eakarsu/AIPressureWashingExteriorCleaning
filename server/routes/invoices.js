const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/invoices
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.name as customer_name
       FROM invoices i
       LEFT JOIN customers c ON i.customer_id = c.id
       ORDER BY i.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List invoices error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/invoices/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, c.name as customer_name
       FROM invoices i
       LEFT JOIN customers c ON i.customer_id = c.id
       WHERE i.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get invoice error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/invoices
router.post('/', auth, async (req, res) => {
  try {
    const { customer_id, job_id, quote_id, invoice_number, line_items, subtotal, tax_rate, tax_amount, total, status, due_date, paid_date, payment_method, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO invoices (customer_id, job_id, quote_id, invoice_number, line_items, subtotal, tax_rate, tax_amount, total, status, due_date, paid_date, payment_method, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [customer_id, job_id, quote_id, invoice_number, JSON.stringify(line_items), subtotal, tax_rate, tax_amount, total, status || 'draft', due_date, paid_date, payment_method, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create invoice error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/invoices/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { customer_id, job_id, quote_id, invoice_number, line_items, subtotal, tax_rate, tax_amount, total, status, due_date, paid_date, payment_method, notes } = req.body;
    const result = await pool.query(
      `UPDATE invoices SET customer_id=$1, job_id=$2, quote_id=$3, invoice_number=$4, line_items=$5,
       subtotal=$6, tax_rate=$7, tax_amount=$8, total=$9, status=$10, due_date=$11, paid_date=$12,
       payment_method=$13, notes=$14, updated_at=NOW() WHERE id=$15 RETURNING *`,
      [customer_id, job_id, quote_id, invoice_number, JSON.stringify(line_items), subtotal, tax_rate, tax_amount, total, status, due_date, paid_date, payment_method, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update invoice error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/invoices/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM invoices WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    console.error('Delete invoice error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
