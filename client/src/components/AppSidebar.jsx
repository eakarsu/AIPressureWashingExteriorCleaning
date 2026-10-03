import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AppSidebar.css';

const LINKS = [
  { to: '/codex/custom-viz', label: 'Custom Viz', group: 'Insights' },
  { to: '/codex/operations', label: 'Operations', group: 'Insights' },
  { to: '/dashboard', label: 'Dashboard', group: 'Workspace' },
  { to: '/services', label: 'Services', group: 'Workspace' },
  { to: '/customers', label: 'Customers', group: 'Workspace' },
  { to: '/properties', label: 'Properties', group: 'Workspace' },
  { to: '/quotes', label: 'Quotes', group: 'Workspace' },
  { to: '/jobs', label: 'Jobs', group: 'Workspace' },
  { to: '/crews', label: 'Crews', group: 'Workspace' },
  { to: '/equipment', label: 'Equipment', group: 'Workspace' },
  { to: '/chemicals', label: 'Chemicals', group: 'Workspace' },
  { to: '/photos', label: 'Photos', group: 'Workspace' },
  { to: '/service-plans', label: 'Service Plans', group: 'Workspace' },
  { to: '/invoices', label: 'Invoices', group: 'Workspace' },
  { to: '/contracts', label: 'Contracts', group: 'Workspace' },
  { to: '/fleet', label: 'Fleet', group: 'Workspace' },
  { to: '/maintenance', label: 'Maintenance', group: 'Workspace' },
  { to: '/safety', label: 'Safety', group: 'Workspace' },
  { to: '/insurance', label: 'Insurance', group: 'Workspace' },
  { to: '/environmental', label: 'Environmental', group: 'Workspace' },
  { to: '/training', label: 'Training', group: 'Workspace' },
  { to: '/referrals', label: 'Referrals', group: 'Workspace' },
  { to: '/bookings', label: 'Bookings', group: 'Workspace' },
  { to: '/reviews', label: 'Reviews', group: 'Workspace' },
  { to: '/marketing', label: 'Marketing', group: 'Workspace' },
  { to: '/locations', label: 'Locations', group: 'Workspace' },
  { to: '/route-sheets', label: 'Route Sheets', group: 'Workspace' },
  { to: '/time-tracking', label: 'Time Tracking', group: 'Workspace' },
  { to: '/reports', label: 'Reports', group: 'Workspace' },
  { to: '/ai/quote-estimator', label: 'Quote Estimator', group: 'AI tools' },
  { to: '/ai/chemical-advisor', label: 'Chemical Advisor', group: 'AI tools' },
  { to: '/ai/weather-scheduler', label: 'Weather Scheduler', group: 'AI tools' },
  { to: '/ai/marketing-generator', label: 'Marketing Generator', group: 'AI tools' },
  { to: '/ai/upsell-advisor', label: 'Upsell Advisor', group: 'AI tools' },
  { to: '/ai/quote-generator', label: 'Quote Generator', group: 'AI tools' },
  { to: '/ai/route-optimizer', label: 'Route Optimizer', group: 'AI tools' },
  { to: '/ai/weather-schedule', label: 'Weather Schedule', group: 'AI tools' },
  { to: '/ai/equipment-maintenance-predict', label: 'Equipment Maintenance Predict', group: 'AI tools' },
  { to: '/ai/customer-churn-predict', label: 'Customer Churn Predict', group: 'AI tools' },
  { to: '/', label: 'Dashboard', group: 'Workspace' },
];

export default function AppSidebar() {
  const [query, setQuery] = useState('');
  const visible = LINKS.filter(link => link.label.toLowerCase().includes(query.toLowerCase().trim()));
  return <aside className="codex-side" aria-label="Application navigation">
    <div className="codex-side-brand"><strong>AIPressure Washing Exterior Cleaning</strong><span>Workspace</span></div>
    <label className="codex-side-search-label" htmlFor="codex-side-search">Find a section</label>
    <input id="codex-side-search" className="codex-side-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search navigation" />
    <nav className="codex-side-links" aria-label="Sections">
      {['Workspace', 'AI tools', 'Insights'].map(group => {
        const items = visible.filter(link => link.group === group);
        return items.length ? <div className="codex-side-group" key={group}>
          <span className="codex-side-heading">{group}</span>
          {items.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `codex-side-link${isActive ? ' active' : ''}`}>{link.label}</NavLink>)}
        </div> : null;
      })}
      {visible.length === 0 && <p className="codex-side-empty">No matching sections</p>}
    </nav>
  </aside>;
}
