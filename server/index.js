const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const createCrudRouter = require('./routes/crudHelper');

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Auth routes (custom)
app.use('/api/auth', require('./routes/auth'));

// AI routes (custom)
app.use('/api/ai', require('./routes/ai'));

// Jobs routes (custom with photo upload sub-routes)
app.use('/api/jobs', require('./routes/jobs'));

// Reports routes (custom)
app.use('/api/reports', require('./routes/reports'));

// Generic CRUD routes (auth enforced inside crudHelper)
app.use('/api/services', createCrudRouter('services', { orderBy: 'name ASC' }));
app.use('/api/customers', createCrudRouter('customers', { orderBy: 'created_at DESC' }));
app.use('/api/properties', createCrudRouter('properties', { orderBy: 'created_at DESC' }));
app.use('/api/quotes', createCrudRouter('quotes', { orderBy: 'created_at DESC' }));
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.BACKEND_PORT || 3001;


// === Custom Feature Mounts (batch_06) ===
app.use('/api/cf-agentic-job-orchestration', require('./routes/customFeat01_AgenticJobOrchestration'));
app.use('/api/cf-computer-vision-job-estimation', require('./routes/customFeat02_ComputerVisionJobEstimation'));
app.use('/api/cf-crew-mobile-companion', require('./routes/customFeat03_CrewMobileCompanion'));
app.use('/api/cf-seasonal-demand-forecasting', require('./routes/customFeat04_SeasonalDemandForecasting'));
app.use('/api/cf-customer-lifecycle-optimization', require('./routes/customFeat05_CustomerLifecycleOptimization'));


// === Batch 06 Gaps & Frontend Mounts ===
app.use('/api/gap-equipment-without-equipment', require('./routes/gapFeat_equipment_without_equipment'));
app.use('/api/gap-crews-without-crew', require('./routes/gapFeat_crews_without_crew'));
app.use('/api/gap-customers-without-customer', require('./routes/gapFeat_customers_without_customer'));
app.use('/api/gap-contracts-without-contract', require('./routes/gapFeat_contracts_without_contract'));
app.use('/api/gap-limited-mobile-app-for-crew-1-mobile-reference-no-', require('./routes/gapFeat_limited_mobile_app_for_crew_1_mobile_reference_no_'));
app.use('/api/gap-no-real', require('./routes/gapFeat_no_real'));
app.use('/api/gap-no-integration-with-payment-processing-square-stri', require('./routes/gapFeat_no_integration_with_payment_processing_square_stri'));
app.use('/api/gap-limited-customer-self', require('./routes/gapFeat_limited_customer_self'));
app.use('/api/gap-no-integration-with-accounting-quickbooks-freshboo', require('./routes/gapFeat_no_integration_with_accounting_quickbooks_freshboo'));
app.use('/api/gap-no-webhooks', require('./routes/gapFeat_no_webhooks'));
app.use('/api/gap-frontend-severely-underbuilt-for-29', require('./routes/gapFeat_frontend_severely_underbuilt_for_29'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
