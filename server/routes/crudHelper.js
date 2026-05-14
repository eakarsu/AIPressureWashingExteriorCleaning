const pool = require('../db');
const auth = require('../middleware/auth');

function createCrudRouter(tableName, options = {}) {
  const router = require('express').Router();
  const orderBy = options.orderBy || 'created_at DESC';
  const useAuth = options.publicGet ? false : true;

  // GET / - List all (with pagination)
  router.get('/', useAuth ? auth : (req, res, next) => next(), async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;

      const countRes = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
      const total = parseInt(countRes.rows[0].count);

      const result = await pool.query(
        `SELECT * FROM ${tableName} ORDER BY ${orderBy} LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      res.json({
        data: result.rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      console.error(`List ${tableName} error:`, err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // GET /:id - Get one
  router.get('/:id', useAuth ? auth : (req, res, next) => next(), async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(`Get ${tableName} error:`, err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST / - Create
  router.post('/', auth, async (req, res) => {
    try {
      const body = req.body;
      const entries = Object.entries(body).filter(([k, v]) => v !== undefined && v !== '' && k !== 'id');
      if (entries.length === 0) return res.status(400).json({ error: 'No data provided' });

      const keys = entries.map(([k]) => k);
      const values = entries.map(([, v]) => v);
      const placeholders = keys.map((_, i) => `$${i + 1}`);

      const result = await pool.query(
        `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(`Create ${tableName} error:`, err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  // PUT /:id - Update
  router.put('/:id', auth, async (req, res) => {
    try {
      const body = req.body;
      const entries = Object.entries(body).filter(([k, v]) => v !== undefined && k !== 'id' && k !== 'created_at');
      if (entries.length === 0) return res.status(400).json({ error: 'No data provided' });

      const setClauses = entries.map(([k], i) => `${k} = $${i + 1}`);
      const values = entries.map(([, v]) => v === '' ? null : v);

      setClauses.push(`updated_at = NOW()`);

      const result = await pool.query(
        `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE id = $${values.length + 1} RETURNING *`,
        [...values, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (err) {
      if (err.message && err.message.includes('updated_at')) {
        try {
          const entries2 = Object.entries(req.body).filter(([k, v]) => v !== undefined && k !== 'id' && k !== 'created_at');
          const setClauses2 = entries2.map(([k], i) => `${k} = $${i + 1}`);
          const values2 = entries2.map(([, v]) => v === '' ? null : v);
          const result2 = await pool.query(
            `UPDATE ${tableName} SET ${setClauses2.join(', ')} WHERE id = $${values2.length + 1} RETURNING *`,
            [...values2, req.params.id]
          );
          if (result2.rows.length === 0) return res.status(404).json({ error: 'Not found' });
          return res.json(result2.rows[0]);
        } catch (err2) {
          console.error(`Update ${tableName} error:`, err2);
          return res.status(500).json({ error: err2.message || 'Server error' });
        }
      }
      console.error(`Update ${tableName} error:`, err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  });

  // DELETE /:id - Delete
  router.delete('/:id', auth, async (req, res) => {
    try {
      const result = await pool.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error(`Delete ${tableName} error:`, err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}

module.exports = createCrudRouter;
