const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/fleet
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fleet ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('List fleet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/fleet/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fleet WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get fleet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/fleet
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, year, make, model, vin, license_plate, mileage, fuel_type, insurance_policy, registration_expiry, assigned_crew_id, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO fleet (name, type, year, make, model, vin, license_plate, mileage, fuel_type, insurance_policy, registration_expiry, assigned_crew_id, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [name, type, year, make, model, vin, license_plate, mileage, fuel_type, insurance_policy, registration_expiry, assigned_crew_id, status || 'active', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create fleet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/fleet/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, year, make, model, vin, license_plate, mileage, fuel_type, insurance_policy, registration_expiry, assigned_crew_id, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE fleet SET name=$1, type=$2, year=$3, make=$4, model=$5, vin=$6, license_plate=$7,
       mileage=$8, fuel_type=$9, insurance_policy=$10, registration_expiry=$11, assigned_crew_id=$12,
       status=$13, notes=$14, updated_at=NOW() WHERE id=$15 RETURNING *`,
      [name, type, year, make, model, vin, license_plate, mileage, fuel_type, insurance_policy, registration_expiry, assigned_crew_id, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update fleet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/fleet/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM fleet WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error('Delete fleet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
