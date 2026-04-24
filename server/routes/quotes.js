const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/quotes
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.*, c.name as customer_name, p.address as property_address
       FROM quotes q
       LEFT JOIN customers c ON q.customer_id = c.id
       LEFT JOIN properties p ON q.property_id = p.id
       ORDER BY q.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List quotes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/quotes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.*, c.name as customer_name, p.address as property_address
       FROM quotes q
       LEFT JOIN customers c ON q.customer_id = c.id
       LEFT JOIN properties p ON q.property_id = p.id
       WHERE q.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Quote not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get quote error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/quotes
router.post('/', auth, async (req, res) => {
  try {
    const { customer_id, property_id, service_ids, line_items, subtotal, tax_rate, tax_amount, total, status, valid_until, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO quotes (customer_id, property_id, service_ids, line_items, subtotal, tax_rate, tax_amount, total, status, valid_until, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [customer_id, property_id, JSON.stringify(service_ids), JSON.stringify(line_items), subtotal, tax_rate, tax_amount, total, status || 'draft', valid_until, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create quote error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/quotes/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { customer_id, property_id, service_ids, line_items, subtotal, tax_rate, tax_amount, total, status, valid_until, notes } = req.body;
    const result = await pool.query(
      `UPDATE quotes SET customer_id=$1, property_id=$2, service_ids=$3, line_items=$4, subtotal=$5,
       tax_rate=$6, tax_amount=$7, total=$8, status=$9, valid_until=$10, notes=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [customer_id, property_id, JSON.stringify(service_ids), JSON.stringify(line_items), subtotal, tax_rate, tax_amount, total, status, valid_until, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Quote not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update quote error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/quotes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM quotes WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Quote not found' });
    res.json({ message: 'Quote deleted' });
  } catch (err) {
    console.error('Delete quote error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
