import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

const columns = [
  { key: 'job_number', label: 'Job #' },
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'scheduled_date', label: 'Date', type: 'date' },
  { key: 'amount', label: 'Amount', type: 'currency' },
];

const formFields = [
  { key: 'job_number', label: 'Job Number', placeholder: 'J-2024-001' },
  { key: 'customer_id', label: 'Customer ID', type: 'number' },
  { key: 'property_id', label: 'Property ID', type: 'number' },
  { key: 'service_id', label: 'Service ID', type: 'number' },
  { key: 'crew_id', label: 'Crew ID', type: 'number' },
  { key: 'quote_id', label: 'Quote ID', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'] },
  { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'normal', 'high', 'urgent'] },
  { key: 'scheduled_date', label: 'Scheduled Date', type: 'date' },
  { key: 'scheduled_time_start', label: 'Start Time', placeholder: '08:00' },
  { key: 'scheduled_time_end', label: 'End Time', placeholder: '12:00' },
  { key: 'estimated_duration_minutes', label: 'Est. Duration (min)', type: 'number' },
  { key: 'total_sqft', label: 'Total Sq Ft', type: 'number' },
  { key: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

const STATUS_COLORS = {
  completed: { bg: '#e8f5e9', color: '#2e7d32' },
  in_progress: { bg: '#fff3e0', color: '#f57c00' },
  scheduled: { bg: '#e3f2fd', color: '#1565c0' },
  cancelled: { bg: '#fce4ec', color: '#b71c1c' },
  rescheduled: { bg: '#f3e5f5', color: '#6a1b9a' },
};

function Jobs() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs');
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    const initial = {};
    formFields.forEach(f => { initial[f.key] = f.defaultValue || ''; });
    setFormData(initial);
    setShowModal(true);
  };

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/jobs', formData);
      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getDisplayValue = (item, col) => {
    const val = item[col.key];
    if (val == null) return '-';
    if (col.type === 'date') { try { return new Date(val).toLocaleDateString(); } catch { return val; } }
    if (col.type === 'currency') return `$${Number(val).toFixed(2)}`;
    return String(val);
  };

  const filtered = items.filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return columns.some(col => item[col.key] && String(item[col.key]).toLowerCase().includes(q));
  });

  return (
    <div className="feature-page">
      <div className="feature-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1 className="page-title" style={{ margin: 0 }}>📅 Job Scheduling</h1>
        </div>
        <button className="btn btn-success" onClick={openCreate}>+ Add Job</button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span style={{ fontSize: 14, color: '#7986cb' }}>{filtered.length} jobs</span>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>No jobs found</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const id = item.id || item._id;
                const statusStyle = STATUS_COLORS[item.status] || {};
                return (
                  <tr key={id} style={{ cursor: 'pointer' }}>
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.key === 'status' ? (
                          <span style={{
                            padding: '2px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                            backgroundColor: statusStyle.bg || '#f5f5f5',
                            color: statusStyle.color || '#555',
                          }}>
                            {getDisplayValue(item, col)}
                          </span>
                        ) : getDisplayValue(item, col)}
                      </td>
                    ))}
                    <td>
                      <Link
                        to={`/jobs/${id}`}
                        style={{
                          display: 'inline-block', padding: '4px 12px', borderRadius: 6,
                          backgroundColor: '#1565c0', color: '#fff', fontSize: 12,
                          textDecoration: 'none', fontWeight: 500,
                        }}
                      >
                        Detail / AI
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Create New Job</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              {formFields.map(field => (
                <div className="form-group" key={field.key}>
                  <label>{field.label}</label>
                  {field.type === 'select' ? (
                    <select value={formData[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)}>
                      <option value="">Select {field.label}</option>
                      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea value={formData[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder || ''} />
                  ) : (
                    <input type={field.type || 'text'} value={formData[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder || ''} />
                  )}
                </div>
              ))}
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? 'Saving...' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
