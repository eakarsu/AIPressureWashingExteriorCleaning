import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import GenericFeature from './pages/GenericFeature';
import Jobs from './pages/features/Jobs';
import api from './api';

jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn(), Link: ({ children, ...props }) => <a {...props}>{children}</a> }));
jest.mock('./api', () => ({ get: jest.fn() }));
global.IS_REACT_ACT_ENVIRONMENT = true;

const seed = parse(fs.readFileSync(path.resolve(__dirname, '../../server/seed.js'), 'utf8'));
function seedRows(name, keys) {
  let rows;
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'VariableDeclarator' && node.id?.name === name) rows = node.init.elements;
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }
  visit(seed);
  return rows.map((row, index) => ({ id: index + 1, ...Object.fromEntries(keys.map((key, i) => [key, row.elements[i]?.value])) }));
}

let host, root;
beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); jest.clearAllMocks(); });
afterEach(() => { act(() => root.unmount()); host.remove(); });

it('renders 16 customer records from the project seed through the paginated API shape', async () => {
  const rows = seedRows('customersData', ['first_name', 'last_name', 'email']);
  expect(rows).toHaveLength(16);
  api.get.mockResolvedValue({ data: { data: rows, pagination: { page: 1, limit: 20, total: rows.length } } });
  const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await act(async () => root.render(<GenericFeature title="Customers" apiEndpoint="/customers" columns={[{ key: 'first_name', label: 'First Name' }]} formFields={[]} />));
    expect(host.querySelectorAll('tbody tr')).toHaveLength(16);
    expect(host.textContent).toContain(rows[0].first_name);
    expect(errors).not.toHaveBeenCalled();
  } finally { errors.mockRestore(); }
});

it('renders 15 job records from the project seed through the paginated API shape', async () => {
  const rows = seedRows('jobsData', ['job_number']);
  expect(rows).toHaveLength(15);
  api.get.mockResolvedValue({ data: { data: rows, pagination: { page: 1, limit: 20, total: rows.length } } });
  const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await act(async () => root.render(<Jobs />));
    expect(host.querySelectorAll('tbody tr')).toHaveLength(15);
    expect(host.textContent).toContain(rows[0].job_number);
    expect(errors).not.toHaveBeenCalled();
  } finally { errors.mockRestore(); }
});

it('renders at least 15 seed records for every shared business record list', async () => {
  const lists = [
    ['services', 'servicesData', 'name'], ['customers', 'customersData', 'first_name'],
    ['properties', 'propertiesData', 'customer_id'], ['quotes', 'quotesData', 'quote_number'],
    ['crews', 'crewsData', 'name'], ['equipment', 'equipmentData', 'name'],
    ['chemicals', 'chemicalsData', 'name'], ['photos', 'photosData', 'job_id'],
    ['service-plans', 'servicePlansData', 'plan_name'], ['invoices', 'invoicesData', 'invoice_number'],
    ['contracts', 'contractsData', 'contract_number'], ['fleet', 'fleetData', 'vehicle_type'],
    ['maintenance', 'maintenanceData', 'equipment_id'], ['safety', 'safetyData', 'job_id'],
    ['insurance', 'insuranceData', 'policy_type'], ['environmental', 'envData', 'compliance_type'],
    ['training', 'trainingData', 'user_id'], ['referrals', 'referralsData', 'referrer_customer_id'],
    ['bookings', 'bookingsData', 'booking_number'], ['reviews', 'reviewsData', 'customer_id'],
    ['marketing', 'marketingData', 'name'], ['locations', 'locationsData', 'name'],
    ['route-sheets', 'routeData', 'route_date'], ['time-tracking', 'timeData', 'user_id'],
  ];
  const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    for (const [endpoint, seedName, field] of lists) {
      const rows = seedRows(seedName, [field]);
      expect(rows.length).toBeGreaterThanOrEqual(15);
      api.get.mockResolvedValueOnce({ data: { data: rows, pagination: { page: 1, limit: 20, total: rows.length } } });
      await act(async () => root.render(<GenericFeature title={endpoint} apiEndpoint={`/${endpoint}`} columns={[{ key: field, label: field }]} formFields={[]} />));
      expect(host.querySelectorAll('tbody tr').length).toBeGreaterThanOrEqual(15);
    }
    expect(errors).not.toHaveBeenCalled();
  } finally { errors.mockRestore(); }
});

it('shows a load error for an unexpected payload instead of rendering a broken record list', async () => {
  api.get.mockResolvedValue({ data: { data: { error: 'unexpected object' } } });
  const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await act(async () => root.render(<GenericFeature title="Customers" apiEndpoint="/customers" columns={[{ key: 'first_name', label: 'First Name' }]} formFields={[]} />));
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Unable to load records');
    expect(errors).toHaveBeenCalledTimes(1);
  } finally { errors.mockRestore(); }
});
