import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import CompleteAIExamples from './components/CompleteAIExamples';
import AIReport from './components/AIReport';
import AIWorkspace from './components/AIWorkspace';
import Login from './pages/Login';
import RouteOptimizer from './pages/ai/RouteOptimizer';
import WeatherSchedule from './pages/ai/WeatherSchedule';
import api from './api';

const mockLogin = jest.fn();
const mockNavigate = jest.fn();
jest.mock('./App', () => ({ useAuth: () => ({ login: mockLogin }) }));
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));
jest.mock('./api', () => ({ post: jest.fn() }));

global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;
beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); jest.clearAllMocks(); });
afterEach(() => { act(() => root.unmount()); host.remove(); });

it('fills required and optional native fields without submitting or changing a saved reference or file', () => {
  let submitted = 0;
  act(() => root.render(<CompleteAIExamples context="Exterior cleaning scheduling"><form onSubmit={event => { event.preventDefault(); submitted++; }}>
    <input data-ai-field="address" required />
    <textarea data-ai-field="additional_details" />
    <select data-ai-field="job_id" defaultValue="job-7"><option value="job-7">Existing job</option><option value="job-8">Other job</option></select>
    <input type="file" data-ai-field="photo" />
    <button type="submit">Generate</button>
  </form></CompleteAIExamples>));
  const samples = [...host.querySelectorAll('button')].filter(button => button.textContent.includes('Demo AI'));
  expect(samples).toHaveLength(3);
  for (const sample of samples) {
    act(() => sample.click());
    expect(host.querySelector('[data-ai-field="address"]').value).toBeTruthy();
    expect(host.querySelector('[data-ai-field="additional_details"]').value).toBeTruthy();
    expect(host.querySelector('[data-ai-field="job_id"]').value).toBe('job-7');
    expect(host.querySelector('[data-ai-field="photo"]').files).toHaveLength(0);
    expect(submitted).toBe(0);
  }
});

it('renders returned and saved structured JSON with false, zero, and empty strings', () => {
  const payload = { details: { approved: false, cost: 0, note: '' }, steps: [{ task: 'Protect plants', complete: false }] };
  act(() => root.render(<AIReport response={{ result_json: payload, result: JSON.stringify(payload) }} title="Review" />));
  expect(host.textContent).toContain('Approved');
  expect(host.textContent).toContain('No');
  expect(host.textContent).toContain('Cost');
  expect(host.textContent).toContain('0');
  expect(host.textContent).toContain('(empty string)');
  expect(host.querySelector('table')).not.toBeNull();
  expect(host.textContent).not.toContain('{"details"');
});

it('uses configured demo login endpoint only after the demo button is clicked', async () => {
  api.post.mockResolvedValue({ data: { user: { id: 7 }, token: 'fixture-token' } });
  await act(async () => root.render(<Login />));
  expect(api.post).not.toHaveBeenCalled();
  const button = [...host.querySelectorAll('button')].find(item => item.textContent.includes('Log In as Demo'));
  expect(button.type).toBe('button');
  await act(async () => button.click());
  expect(api.post).toHaveBeenCalledWith('/auth/demo-login');
  expect(mockLogin).toHaveBeenCalled();
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});

it('opens saved history in the structured detail renderer without generating', async () => {
  const priorFetch = global.fetch;
  const payload = { findings: { needs_review: false, count: 0, comment: '' }, actions: [{ task: 'Confirm water access', owner: 'Operations' }] };
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [{ id: 42, feature: 'fixture-feature', input: { goal: 'Review property' }, result: JSON.stringify(payload), result_json: payload, model: 'fixture', created_at: '2026-10-10T00:00:00Z' }] }) });
  try {
    await act(async () => root.render(<AIWorkspace feature={{ id: 'fixture-feature', title: 'Fixture report', description: 'Fixture' }} token="fixture-token" />));
    const row = host.querySelector('.ai-history-row');
    expect(row).not.toBeNull();
    await act(async () => row.click());
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog.textContent).toContain('Needs review');
    expect(dialog.textContent).toContain('No');
    expect(dialog.textContent).toContain('Count');
    expect(dialog.textContent).toContain('0');
    expect(dialog.textContent).toContain('(empty string)');
    expect(dialog.querySelector('table')).not.toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  } finally { global.fetch = priorFetch; }
});

it('fills each native scheduling form without invoking its AI endpoint', () => {
  for (const Page of [RouteOptimizer, WeatherSchedule]) {
    act(() => root.render(<Page />));
    const samples = [...host.querySelectorAll('button')].filter(button => button.textContent.includes('Demo AI'));
    expect(samples).toHaveLength(3);
    for (const sample of samples) {
      act(() => sample.click());
      const form = host.querySelector('form');
      for (const field of form.querySelectorAll('input:not([type="hidden"]), textarea, select')) expect(field.value).not.toBe('');
      expect(api.post).not.toHaveBeenCalled();
    }
  }
});

it('fills every AI workspace field for each example without running a report', async () => {
  const priorFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [] }) });
  try {
    await act(async () => root.render(<AIWorkspace feature={{ id: 'fixture-feature', title: 'Exterior cleaning review', description: 'Fixture' }} token="fixture-token" />));
    const buttons = [...host.querySelectorAll('.ai-preset-bar button')];
    expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      act(() => button.click());
      const fields = [...host.querySelectorAll('.ai-form-grid textarea, .ai-form-grid input, .ai-form-grid select')];
      expect(fields).toHaveLength(10);
      fields.forEach(field => expect(field.value).not.toBe(''));
      expect(global.fetch).toHaveBeenCalledTimes(1);
    }
  } finally { global.fetch = priorFetch; }
});
