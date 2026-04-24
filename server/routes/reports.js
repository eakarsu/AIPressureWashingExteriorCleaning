const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/reports - List available reports
router.get('/', auth, async (req, res) => {
  try {
    res.json([
      { id: 'revenue-summary', name: 'Revenue Summary' },
      { id: 'job-summary', name: 'Job Summary' },
      { id: 'crew-performance', name: 'Crew Performance' },
      { id: 'customer-summary', name: 'Customer Summary' },
      { id: 'outstanding-invoices', name: 'Outstanding Invoices' }
    ]);
  } catch (err) {
    console.error('List reports error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports/:id - Get specific report
router.get('/:id', auth, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const startDate = start_date || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = end_date || new Date().toISOString().split('T')[0];

    let result;
    switch (req.params.id) {
      case 'revenue-summary':
        result = await pool.query(
          `SELECT
            COUNT(*) as total_invoices,
            COALESCE(SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END), 0) as total_revenue,
            COALESCE(SUM(CASE WHEN status = 'pending' OR status = 'sent' THEN total ELSE 0 END), 0) as outstanding,
            COALESCE(AVG(total), 0) as avg_invoice_amount
           FROM invoices WHERE created_at BETWEEN $1 AND $2`,
          [startDate, endDate]
        );
        return res.json({ report: 'revenue-summary', period: { startDate, endDate }, data: result.rows[0] });

      case 'job-summary':
        result = await pool.query(
          `SELECT
            COUNT(*) as total_jobs,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
            COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled,
            COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
           FROM jobs WHERE scheduled_date BETWEEN $1 AND $2`,
          [startDate, endDate]
        );
        return res.json({ report: 'job-summary', period: { startDate, endDate }, data: result.rows[0] });

      case 'crew-performance':
        result = await pool.query(
          `SELECT cr.name as crew_name, COUNT(j.id) as total_jobs,
            COUNT(CASE WHEN j.status = 'completed' THEN 1 END) as completed_jobs,
            COALESCE(AVG(j.actual_duration), 0) as avg_duration
           FROM crews cr
           LEFT JOIN jobs j ON j.crew_id = cr.id AND j.scheduled_date BETWEEN $1 AND $2
           GROUP BY cr.id, cr.name ORDER BY completed_jobs DESC`,
          [startDate, endDate]
        );
        return res.json({ report: 'crew-performance', period: { startDate, endDate }, data: result.rows });

      case 'customer-summary':
        result = await pool.query(
          `SELECT
            COUNT(DISTINCT c.id) as total_customers,
            COUNT(DISTINCT CASE WHEN c.type = 'residential' THEN c.id END) as residential,
            COUNT(DISTINCT CASE WHEN c.type = 'commercial' THEN c.id END) as commercial,
            COUNT(DISTINCT j.customer_id) as active_customers
           FROM customers c
           LEFT JOIN jobs j ON j.customer_id = c.id AND j.scheduled_date BETWEEN $1 AND $2`,
          [startDate, endDate]
        );
        return res.json({ report: 'customer-summary', period: { startDate, endDate }, data: result.rows[0] });

      case 'outstanding-invoices':
        result = await pool.query(
          `SELECT i.*, c.name as customer_name
           FROM invoices i
           LEFT JOIN customers c ON i.customer_id = c.id
           WHERE i.status IN ('pending', 'sent', 'overdue')
           ORDER BY i.due_date ASC`
        );
        return res.json({ report: 'outstanding-invoices', data: result.rows });

      default:
        return res.status(404).json({ error: 'Report not found' });
    }
  } catch (err) {
    console.error('Get report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reports - Generate custom report
router.post('/', auth, async (req, res) => {
  try {
    const { report_type, start_date, end_date, filters } = req.body;
    res.json({ message: 'Custom report generation', report_type, start_date, end_date, filters });
  } catch (err) {
    console.error('Generate report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/reports/:id - Not applicable, return info
router.put('/:id', auth, async (req, res) => {
  res.status(405).json({ error: 'Reports cannot be updated' });
});

// DELETE /api/reports/:id - Not applicable, return info
router.delete('/:id', auth, async (req, res) => {
  res.status(405).json({ error: 'Reports cannot be deleted' });
});

module.exports = router;
