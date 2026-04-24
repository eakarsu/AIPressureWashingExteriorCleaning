const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/bookings
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, c.name as customer_name
       FROM bookings b
       LEFT JOIN customers c ON b.customer_id = c.id
       ORDER BY b.requested_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List bookings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/bookings (public - no auth required for online booking)
router.post('/', async (req, res) => {
  try {
    const { customer_id, customer_name, customer_email, customer_phone, service_ids, property_address, property_type, square_footage, requested_date, requested_time, notes, source } = req.body;
    const result = await pool.query(
      `INSERT INTO bookings (customer_id, customer_name, customer_email, customer_phone, service_ids, property_address, property_type, square_footage, requested_date, requested_time, notes, source, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending') RETURNING *`,
      [customer_id, customer_name, customer_email, customer_phone, JSON.stringify(service_ids), property_address, property_type, square_footage, requested_date, requested_time, notes, source || 'website']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/bookings/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { customer_id, customer_name, customer_email, customer_phone, service_ids, property_address, property_type, square_footage, requested_date, requested_time, notes, source, status } = req.body;
    const result = await pool.query(
      `UPDATE bookings SET customer_id=$1, customer_name=$2, customer_email=$3, customer_phone=$4,
       service_ids=$5, property_address=$6, property_type=$7, square_footage=$8, requested_date=$9,
       requested_time=$10, notes=$11, source=$12, status=$13, updated_at=NOW() WHERE id=$14 RETURNING *`,
      [customer_id, customer_name, customer_email, customer_phone, JSON.stringify(service_ids), property_address, property_type, square_footage, requested_date, requested_time, notes, source, status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error('Delete booking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
