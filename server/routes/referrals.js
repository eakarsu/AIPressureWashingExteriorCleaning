const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/referrals
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, c1.name as referrer_name, c2.name as referred_name
       FROM referrals r
       LEFT JOIN customers c1 ON r.referrer_id = c1.id
       LEFT JOIN customers c2 ON r.referred_id = c2.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('List referrals error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/referrals/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM referrals WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Referral not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get referral error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/referrals
router.post('/', auth, async (req, res) => {
  try {
    const { referrer_id, referred_id, referred_name, referred_email, referred_phone, referral_code, reward_type, reward_amount, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO referrals (referrer_id, referred_id, referred_name, referred_email, referred_phone, referral_code, reward_type, reward_amount, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [referrer_id, referred_id, referred_name, referred_email, referred_phone, referral_code, reward_type, reward_amount, status || 'pending', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create referral error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/referrals/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { referrer_id, referred_id, referred_name, referred_email, referred_phone, referral_code, reward_type, reward_amount, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE referrals SET referrer_id=$1, referred_id=$2, referred_name=$3, referred_email=$4,
       referred_phone=$5, referral_code=$6, reward_type=$7, reward_amount=$8, status=$9, notes=$10,
       updated_at=NOW() WHERE id=$11 RETURNING *`,
      [referrer_id, referred_id, referred_name, referred_email, referred_phone, referral_code, reward_type, reward_amount, status, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Referral not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update referral error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/referrals/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM referrals WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Referral not found' });
    res.json({ message: 'Referral deleted' });
  } catch (err) {
    console.error('Delete referral error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
