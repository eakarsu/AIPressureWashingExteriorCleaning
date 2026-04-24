const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/environmental
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM environmental_compliance ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('List environmental error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/environmental/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM environmental_compliance WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get environmental error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/environmental
router.post('/', auth, async (req, res) => {
  try {
    const { job_id, type, description, water_reclaim_method, chemicals_used, disposal_method, permit_number, compliant, inspector, inspection_date, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO environmental_compliance (job_id, type, description, water_reclaim_method, chemicals_used, disposal_method, permit_number, compliant, inspector, inspection_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [job_id, type, description, water_reclaim_method, JSON.stringify(chemicals_used), disposal_method, permit_number, compliant, inspector, inspection_date, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create environmental error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/environmental/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { job_id, type, description, water_reclaim_method, chemicals_used, disposal_method, permit_number, compliant, inspector, inspection_date, notes } = req.body;
    const result = await pool.query(
      `UPDATE environmental_compliance SET job_id=$1, type=$2, description=$3, water_reclaim_method=$4,
       chemicals_used=$5, disposal_method=$6, permit_number=$7, compliant=$8, inspector=$9,
       inspection_date=$10, notes=$11, updated_at=NOW() WHERE id=$12 RETURNING *`,
      [job_id, type, description, water_reclaim_method, JSON.stringify(chemicals_used), disposal_method, permit_number, compliant, inspector, inspection_date, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update environmental error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/environmental/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM environmental_compliance WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    console.error('Delete environmental error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
