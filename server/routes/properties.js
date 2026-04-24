const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/properties
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as customer_name FROM properties p
       LEFT JOIN customers c ON p.customer_id = c.id ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List properties error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/properties/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name as customer_name FROM properties p
       LEFT JOIN customers c ON p.customer_id = c.id WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get property error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/properties
router.post('/', auth, async (req, res) => {
  try {
    const { customer_id, address, city, state, zip, property_type, square_footage, num_stories, roof_type, siding_type, driveway_sqft, deck_sqft, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO properties (customer_id, address, city, state, zip, property_type, square_footage, num_stories, roof_type, siding_type, driveway_sqft, deck_sqft, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [customer_id, address, city, state, zip, property_type, square_footage, num_stories, roof_type, siding_type, driveway_sqft, deck_sqft, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/properties/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { customer_id, address, city, state, zip, property_type, square_footage, num_stories, roof_type, siding_type, driveway_sqft, deck_sqft, notes } = req.body;
    const result = await pool.query(
      `UPDATE properties SET customer_id=$1, address=$2, city=$3, state=$4, zip=$5, property_type=$6,
       square_footage=$7, num_stories=$8, roof_type=$9, siding_type=$10, driveway_sqft=$11, deck_sqft=$12,
       notes=$13, updated_at=NOW() WHERE id=$14 RETURNING *`,
      [customer_id, address, city, state, zip, property_type, square_footage, num_stories, roof_type, siding_type, driveway_sqft, deck_sqft, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/properties/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
