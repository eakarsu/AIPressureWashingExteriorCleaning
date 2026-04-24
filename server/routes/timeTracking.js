const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/time-tracking
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tt.*, j.scheduled_date as job_date, cr.name as crew_name
       FROM time_tracking tt
       LEFT JOIN jobs j ON tt.job_id = j.id
       LEFT JOIN crews cr ON tt.crew_id = cr.id
       ORDER BY tt.clock_in DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List time tracking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/time-tracking/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM time_tracking WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Time entry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get time tracking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/time-tracking
router.post('/', auth, async (req, res) => {
  try {
    const { employee_name, crew_id, job_id, clock_in, clock_out, break_minutes, total_hours, hourly_rate, type, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO time_tracking (employee_name, crew_id, job_id, clock_in, clock_out, break_minutes, total_hours, hourly_rate, type, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [employee_name, crew_id, job_id, clock_in, clock_out, break_minutes, total_hours, hourly_rate, type || 'regular', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create time tracking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/time-tracking/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { employee_name, crew_id, job_id, clock_in, clock_out, break_minutes, total_hours, hourly_rate, type, notes } = req.body;
    const result = await pool.query(
      `UPDATE time_tracking SET employee_name=$1, crew_id=$2, job_id=$3, clock_in=$4, clock_out=$5,
       break_minutes=$6, total_hours=$7, hourly_rate=$8, type=$9, notes=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [employee_name, crew_id, job_id, clock_in, clock_out, break_minutes, total_hours, hourly_rate, type, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Time entry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update time tracking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/time-tracking/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM time_tracking WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Time entry not found' });
    res.json({ message: 'Time entry deleted' });
  } catch (err) {
    console.error('Delete time tracking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
