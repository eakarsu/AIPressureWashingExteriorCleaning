const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/maintenance
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, e.name as equipment_name
       FROM maintenance_logs m
       LEFT JOIN equipment e ON m.equipment_id = e.id
       ORDER BY m.service_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List maintenance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/maintenance/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maintenance_logs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Maintenance log not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get maintenance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/maintenance
router.post('/', auth, async (req, res) => {
  try {
    const { equipment_id, fleet_id, type, description, service_date, next_service_date, cost, performed_by, parts_used, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO maintenance_logs (equipment_id, fleet_id, type, description, service_date, next_service_date, cost, performed_by, parts_used, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [equipment_id, fleet_id, type, description, service_date, next_service_date, cost, performed_by, JSON.stringify(parts_used), notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create maintenance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/maintenance/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { equipment_id, fleet_id, type, description, service_date, next_service_date, cost, performed_by, parts_used, notes } = req.body;
    const result = await pool.query(
      `UPDATE maintenance_logs SET equipment_id=$1, fleet_id=$2, type=$3, description=$4, service_date=$5,
       next_service_date=$6, cost=$7, performed_by=$8, parts_used=$9, notes=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [equipment_id, fleet_id, type, description, service_date, next_service_date, cost, performed_by, JSON.stringify(parts_used), notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Maintenance log not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update maintenance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/maintenance/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM maintenance_logs WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Maintenance log not found' });
    res.json({ message: 'Maintenance log deleted' });
  } catch (err) {
    console.error('Delete maintenance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
