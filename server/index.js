const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const createCrudRouter = require('./routes/crudHelper');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Auth routes (custom - not generic CRUD)
app.use('/api/auth', require('./routes/auth'));

// AI routes (custom)
app.use('/api/ai', require('./routes/ai'));

// Reports routes (custom)
app.use('/api/reports', require('./routes/reports'));

// Generic CRUD routes using the helper (matches actual DB table/column names)
app.use('/api/services', createCrudRouter('services', { orderBy: 'name ASC' }));
app.use('/api/customers', createCrudRouter('customers', { orderBy: 'created_at DESC' }));
app.use('/api/properties', createCrudRouter('properties', { orderBy: 'created_at DESC' }));
app.use('/api/quotes', createCrudRouter('quotes', { orderBy: 'created_at DESC' }));
app.use('/api/jobs', createCrudRouter('jobs', { orderBy: 'scheduled_date DESC NULLS LAST' }));
app.use('/api/crews', createCrudRouter('crews', { orderBy: 'name ASC' }));
app.use('/api/equipment', createCrudRouter('equipment', { orderBy: 'name ASC' }));
app.use('/api/chemicals', createCrudRouter('chemicals', { orderBy: 'name ASC' }));
app.use('/api/photos', createCrudRouter('photos', { orderBy: 'created_at DESC' }));
app.use('/api/service-plans', createCrudRouter('service_plans', { orderBy: 'created_at DESC' }));
app.use('/api/invoices', createCrudRouter('invoices', { orderBy: 'created_at DESC' }));
app.use('/api/contracts', createCrudRouter('contracts', { orderBy: 'created_at DESC' }));
app.use('/api/fleet', createCrudRouter('fleet_vehicles', { orderBy: 'created_at DESC' }));
app.use('/api/maintenance', createCrudRouter('maintenance_logs', { orderBy: 'performed_date DESC NULLS LAST' }));
app.use('/api/safety', createCrudRouter('safety_checklists', { orderBy: 'checklist_date DESC' }));
app.use('/api/insurance', createCrudRouter('insurance_certificates', { orderBy: 'end_date ASC' }));
app.use('/api/environmental', createCrudRouter('environmental_compliance', { orderBy: 'created_at DESC' }));
app.use('/api/training', createCrudRouter('training_records', { orderBy: 'completed_date DESC NULLS LAST' }));
app.use('/api/referrals', createCrudRouter('referrals', { orderBy: 'created_at DESC' }));
app.use('/api/bookings', createCrudRouter('bookings', { orderBy: 'created_at DESC' }));
app.use('/api/reviews', createCrudRouter('reviews', { orderBy: 'created_at DESC', publicGet: true }));
app.use('/api/marketing', createCrudRouter('marketing_campaigns', { orderBy: 'created_at DESC' }));
app.use('/api/locations', createCrudRouter('locations', { orderBy: 'name ASC' }));
app.use('/api/route-sheets', createCrudRouter('route_sheets', { orderBy: 'route_date DESC' }));
app.use('/api/time-tracking', createCrudRouter('time_entries', { orderBy: 'entry_date DESC' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.BACKEND_PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
