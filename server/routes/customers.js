const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/customers
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('List customers error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/customers/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get customer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/customers
router.post('/', auth, async (req, res) => {
  try {
    const { first_name, last_name, email, phone, alt_phone, customer_type, company_name,
            billing_address_line1, billing_address_line2, billing_city, billing_state, billing_zip,
            referral_source, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO customers (first_name, last_name, email, phone, alt_phone, customer_type, company_name,
       billing_address_line1, billing_address_line2, billing_city, billing_state, billing_zip, referral_source, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [first_name, last_name, email, phone, alt_phone, customer_type || 'residential', company_name,
       billing_address_line1, billing_address_line2, billing_city, billing_state, billing_zip, referral_source, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create customer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/customers/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { first_name, last_name, email, phone, alt_phone, customer_type, company_name,
            billing_address_line1, billing_address_line2, billing_city, billing_state, billing_zip,
            referral_source, notes } = req.body;
    const result = await pool.query(
      `UPDATE customers SET first_name=$1, last_name=$2, email=$3, phone=$4, alt_phone=$5,
       customer_type=$6, company_name=$7, billing_address_line1=$8, billing_address_line2=$9,
       billing_city=$10, billing_state=$11, billing_zip=$12, referral_source=$13, notes=$14,
       updated_at=NOW() WHERE id=$15 RETURNING *`,
      [first_name, last_name, email, phone, alt_phone, customer_type, company_name,
       billing_address_line1, billing_address_line2, billing_city, billing_state, billing_zip,
       referral_source, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update customer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    console.error('Delete customer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
