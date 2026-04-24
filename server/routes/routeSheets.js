const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/route-sheets
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rs.*, cr.name as crew_name
       FROM route_sheets rs
       LEFT JOIN crews cr ON rs.crew_id = cr.id
       ORDER BY rs.route_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List route sheets error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/route-sheets/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM route_sheets WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Route sheet not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get route sheet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/route-sheets
router.post('/', auth, async (req, res) => {
  try {
    const { crew_id, route_date, stops, total_drive_time, total_job_time, start_location, end_location, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO route_sheets (crew_id, route_date, stops, total_drive_time, total_job_time, start_location, end_location, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [crew_id, route_date, JSON.stringify(stops), total_drive_time, total_job_time, start_location, end_location, status || 'planned', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create route sheet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/route-sheets/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { crew_id, route_date, stops, total_drive_time, total_job_time, start_location, end_location, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE route_sheets SET crew_id=$1, route_date=$2, stops=$3, total_drive_time=$4, total_job_time=$5,
       start_location=$6, end_location=$7, status=$8, notes=$9, updated_at=NOW() WHERE id=$10 RETURNING *`,
      [crew_id, route_date, JSON.stringify(stops), total_drive_time, total_job_time, start_location, end_location, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Route sheet not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update route sheet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/route-sheets/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM route_sheets WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Route sheet not found' });
    res.json({ message: 'Route sheet deleted' });
  } catch (err) {
    console.error('Delete route sheet error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
