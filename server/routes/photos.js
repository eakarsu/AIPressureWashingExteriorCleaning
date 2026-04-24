const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/photos
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ph.*, j.scheduled_date as job_date, p.address as property_address
       FROM photos ph
       LEFT JOIN jobs j ON ph.job_id = j.id
       LEFT JOIN properties p ON ph.property_id = p.id
       ORDER BY ph.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List photos error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/photos/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM photos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Photo not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get photo error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/photos
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { job_id, property_id, photo_type, caption, notes } = req.body;
    const file_url = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await pool.query(
      `INSERT INTO photos (job_id, property_id, photo_type, file_url, caption, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [job_id, property_id, photo_type || 'before', file_url, caption, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create photo error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/photos/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { photo_type, caption, notes } = req.body;
    const result = await pool.query(
      `UPDATE photos SET photo_type=$1, caption=$2, notes=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
      [photo_type, caption, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Photo not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update photo error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/photos/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM photos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Photo not found' });
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    console.error('Delete photo error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
