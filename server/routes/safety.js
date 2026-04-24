const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/safety
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM safety_checklists ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('List safety checklists error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/safety/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM safety_checklists WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Safety checklist not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get safety checklist error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/safety
router.post('/', auth, async (req, res) => {
  try {
    const { job_id, crew_id, checklist_type, items, completed_by, completed_at, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO safety_checklists (job_id, crew_id, checklist_type, items, completed_by, completed_at, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [job_id, crew_id, checklist_type, JSON.stringify(items), completed_by, completed_at, status || 'pending', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create safety checklist error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/safety/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { job_id, crew_id, checklist_type, items, completed_by, completed_at, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE safety_checklists SET job_id=$1, crew_id=$2, checklist_type=$3, items=$4, completed_by=$5,
       completed_at=$6, status=$7, notes=$8, updated_at=NOW() WHERE id=$9 RETURNING *`,
      [job_id, crew_id, checklist_type, JSON.stringify(items), completed_by, completed_at, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Safety checklist not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update safety checklist error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/safety/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM safety_checklists WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Safety checklist not found' });
    res.json({ message: 'Safety checklist deleted' });
  } catch (err) {
    console.error('Delete safety checklist error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
