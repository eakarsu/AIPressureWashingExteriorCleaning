import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Service Catalog', icon: '🧹', desc: 'Manage cleaning services & pricing', path: '/services' },
  { title: 'Customers', icon: '👥', desc: 'Customer database & contacts', path: '/customers' },
  { title: 'Properties', icon: '🏠', desc: 'Property details & specs', path: '/properties' },
  { title: 'Quotes & Estimation', icon: '📋', desc: 'Create & manage quotes', path: '/quotes' },
  { title: 'Job Scheduling', icon: '📅', desc: 'Schedule & track jobs', path: '/jobs' },
  { title: 'Crew Management', icon: '👷', desc: 'Manage crews & assignments', path: '/crews' },
  { title: 'Equipment Inventory', icon: '🔧', desc: 'Track equipment & assets', path: '/equipment' },
  { title: 'Chemical Inventory', icon: '🧪', desc: 'Chemical stock & usage', path: '/chemicals' },
  { title: 'Photo Documentation', icon: '📷', desc: 'Before & after photos', path: '/photos' },
  { title: 'Recurring Service Plans', icon: '🔄', desc: 'Subscription & recurring plans', path: '/service-plans' },
  { title: 'Invoicing & Payments', icon: '💰', desc: 'Invoices & payment tracking', path: '/invoices' },
  { title: 'Commercial Contracts', icon: '📝', desc: 'Contract management', path: '/contracts' },
  { title: 'Fleet Tracking', icon: '🚛', desc: 'Vehicle fleet management', path: '/fleet' },
  { title: 'Equipment Maintenance', icon: '🔩', desc: 'Maintenance schedules', path: '/maintenance' },
  { title: 'Safety Checklists', icon: '✅', desc: 'Safety protocols & checks', path: '/safety' },
  { title: 'Insurance Certificates', icon: '🛡️', desc: 'Insurance documentation', path: '/insurance' },
  { title: 'Environmental Compliance', icon: '🌿', desc: 'EPA & environmental regs', path: '/environmental' },
  { title: 'Training Records', icon: '📚', desc: 'Employee training & certs', path: '/training' },
  { title: 'Referral Tracking', icon: '🤝', desc: 'Referral program management', path: '/referrals' },
  { title: 'Online Bookings', icon: '🌐', desc: 'Online booking management', path: '/bookings' },
  { title: 'Reviews', icon: '⭐', desc: 'Customer reviews & ratings', path: '/reviews' },
  { title: 'Marketing Campaigns', icon: '📣', desc: 'Campaign management', path: '/marketing' },
  { title: 'Locations', icon: '📍', desc: 'Service area management', path: '/locations' },
  { title: 'Route Sheets', icon: '🗺️', desc: 'Daily route planning', path: '/route-sheets' },
  { title: 'Time Tracking', icon: '⏱️', desc: 'Employee time & attendance', path: '/time-tracking' },
  { title: 'Financial Reports', icon: '📊', desc: 'Revenue & expense reports', path: '/reports' },
];

const aiFeatures = [
  { title: 'AI Quote Estimator', icon: '🤖', desc: 'AI-powered quote generation', path: '/ai/quote-estimator' },
  { title: 'AI Chemical Advisor', icon: '🧬', desc: 'Smart chemical recommendations', path: '/ai/chemical-advisor' },
  { title: 'AI Weather Scheduler', icon: '⛅', desc: 'Weather-optimized scheduling', path: '/ai/weather-scheduler' },
  { title: 'AI Marketing Generator', icon: '✨', desc: 'AI-generated marketing content', path: '/ai/marketing-generator' },
  { title: 'AI Upsell Advisor', icon: '💡', desc: 'Smart upsell recommendations', path: '/ai/upsell-advisor' },
  { title: 'AI Quote Generator', icon: '💰', desc: 'Structured quote with line items', path: '/ai/quote-generator' },
  { title: 'AI Route Optimizer', icon: '🗺️', desc: 'Optimize multi-stop job routes', path: '/ai/route-optimizer' },
  { title: 'AI Weather Schedule', icon: '🌤️', desc: 'Weather-aware job scheduling', path: '/ai/weather-schedule' },
  { title: 'Job Detail & Photos', icon: '📷', desc: 'Before/after photos & surface AI', path: '/jobs' },
  { title: 'AI Equipment Maintenance Predict', icon: '🛠️', desc: 'Predict next-service windows', path: '/ai/equipment-maintenance-predict' },
  { title: 'AI Customer Churn Predict', icon: '📉', desc: 'At-risk customers + outreach', path: '/ai/customer-churn-predict' },
];

function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome to your pressure washing business management hub</p>

      <h2 className="section-header">Business Operations</h2>
      <div className="dashboard-grid">
        {features.map((f) => (
          <Link to={f.path} key={f.path} className="dashboard-card">
            <span className="card-icon">{f.icon}</span>
            <div className="card-title">{f.title}</div>
            <div className="card-desc">{f.desc}</div>
          </Link>
        ))}
      </div>

      <h2 className="section-header ai-section">AI-Powered Features</h2>
      <div className="dashboard-grid">
        {aiFeatures.map((f) => (
          <Link to={f.path} key={f.path} className="dashboard-card ai-card">
            <span className="card-icon">{f.icon}</span>
            <div className="card-title">{f.title}</div>
            <div className="card-desc">{f.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
