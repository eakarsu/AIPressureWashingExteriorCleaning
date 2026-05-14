import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function WeatherSchedule() {
  const navigate = useNavigate();
  const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [jobs, setJobs] = useState([{ description: '', address: '', flexible: true }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addJob = () => setJobs(prev => [...prev, { description: '', address: '', flexible: true }]);
  const removeJob = (i) => setJobs(prev => prev.filter((_, idx) => idx !== i));
  const updateJob = (i, key, val) => setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, [key]: val } : j));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/ai/weather-schedule', {
        date_range: { start: dateStart, end: dateEnd },
        job_list: jobs,
      });
      setResult(res.data.data || res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Scheduling failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderRisk = (level) => {
    const colors = { low: '#2e7d32', medium: '#f57c00', high: '#c62828', critical: '#b71c1c' };
    return <span style={{ color: colors[level] || '#555', fontWeight: 700 }}>{level?.toUpperCase() || '-'}</span>;
  };

  return (
    <div className="ai-page">
      <div className="feature-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1 className="page-title" style={{ margin: 0 }}>⛅ Weather-Aware Scheduler</h1>
        </div>
        <span className="ai-badge">AI Powered</span>
      </div>

      <div className="ai-input-section">
        <h3>Schedule Parameters</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Date Range Start</label>
              <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Date Range End</label>
              <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} required />
            </div>
          </div>

          <h4 style={{ marginBottom: 8, marginTop: 16 }}>Jobs to Schedule</h4>
          {jobs.map((job, i) => (
            <div key={i} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>Job {i + 1}</strong>
                {jobs.length > 1 && (
                  <button type="button" onClick={() => removeJob(i)} style={{ color: '#c62828', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Remove</button>
                )}
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" value={job.description} onChange={e => updateJob(i, 'description', e.target.value)} placeholder="House wash + driveway cleaning" />
              </div>
              <div className="form-group">
                <label>Address / Location</label>
                <input type="text" value={job.address} onChange={e => updateJob(i, 'address', e.target.value)} placeholder="123 Oak St, Atlanta, GA" />
              </div>
              <div className="form-group">
                <label>Flexible Scheduling</label>
                <select value={job.flexible ? 'yes' : 'no'} onChange={e => updateJob(i, 'flexible', e.target.value === 'yes')}>
                  <option value="yes">Yes — can reschedule</option>
                  <option value="no">No — fixed date required</option>
                </select>
              </div>
            </div>
          ))}

          <button type="button" onClick={addJob} className="btn" style={{ marginBottom: 12, width: '100%' }}>
            + Add Job
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Analyzing...' : 'Generate Weather Schedule'}
          </button>
        </form>
      </div>

      {error && <div style={{ padding: 24 }}><div className="login-error">{error}</div></div>}

      {loading && (
        <div className="ai-loading">
          <p style={{ fontSize: 16, color: '#2e7d32', fontWeight: 600 }}>AI is analyzing weather patterns and scheduling...</p>
          <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        </div>
      )}

      {result && !loading && (
        <div className="ai-result-section">
          <h2 className="ai-section-title">Weather-Optimized Schedule</h2>

          {/* Scheduling recommendations */}
          {result.scheduling_recommendations?.length > 0 && (
            <div className="ai-result-card">
              <h3>Recommended Schedule</h3>
              {result.scheduling_recommendations.map((rec, i) => (
                <div key={i} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong>{rec.job_description || rec.job || `Job ${i + 1}`}</strong>
                      {rec.recommended_date && <p style={{ margin: '2px 0', color: '#1565c0', fontSize: 13 }}>📅 {rec.recommended_date}</p>}
                      {rec.reasoning && <p style={{ margin: '2px 0', color: '#555', fontSize: 13 }}>{rec.reasoning}</p>}
                    </div>
                    {rec.risk_level && <div style={{ textAlign: 'right' }}>{renderRisk(rec.risk_level)}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Avoid dates */}
          {result.avoid_dates?.length > 0 && (
            <div className="ai-result-card" style={{ borderLeft: '4px solid #c62828' }}>
              <h3 style={{ color: '#c62828' }}>⚠️ Dates to Avoid</h3>
              <ul>
                {result.avoid_dates.map((d, i) => (
                  <li key={i}>{typeof d === 'string' ? d : `${d.date}: ${d.reason}`}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Best windows */}
          {result.best_windows?.length > 0 && (
            <div className="ai-result-card" style={{ borderLeft: '4px solid #2e7d32' }}>
              <h3 style={{ color: '#2e7d32' }}>✅ Best Work Windows</h3>
              <ul>
                {result.best_windows.map((w, i) => (
                  <li key={i}>{typeof w === 'string' ? w : `${w.dates || w.date_range}: ${w.reason || w.description}`}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk flags */}
          {result.risk_flags?.length > 0 && (
            <div className="ai-result-card">
              <h3>Risk Flags</h3>
              <ul>{result.risk_flags.map((f, i) => <li key={i}>{typeof f === 'string' ? f : JSON.stringify(f)}</li>)}</ul>
            </div>
          )}

          {result.notes && <div className="ai-highlight">{result.notes}</div>}
        </div>
      )}
    </div>
  );
}

export default WeatherSchedule;
