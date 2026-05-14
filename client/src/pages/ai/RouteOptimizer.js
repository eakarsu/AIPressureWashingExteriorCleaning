import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function RouteOptimizer() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [locations, setLocations] = useState([
    { address: '', customer_name: '', job_id: '', estimated_duration_minutes: 60 },
  ]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addLocation = () => setLocations(prev => [...prev, { address: '', customer_name: '', job_id: '', estimated_duration_minutes: 60 }]);
  const removeLocation = (i) => setLocations(prev => prev.filter((_, idx) => idx !== i));
  const updateLocation = (i, key, val) => setLocations(prev => prev.map((loc, idx) => idx === i ? { ...loc, [key]: val } : loc));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/ai/optimize-routes', { date, job_locations: locations });
      setResult(res.data.data || res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Route optimization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="feature-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h1 className="page-title" style={{ margin: 0 }}>🗺️ AI Route Optimizer</h1>
        </div>
        <span className="ai-badge">AI Powered</span>
      </div>

      <div className="ai-input-section">
        <h3>Job Locations</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          {locations.map((loc, i) => (
            <div key={i} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong>Stop {i + 1}</strong>
                {locations.length > 1 && (
                  <button type="button" onClick={() => removeLocation(i)} style={{ color: '#c62828', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Remove</button>
                )}
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={loc.address} onChange={e => updateLocation(i, 'address', e.target.value)} placeholder="123 Main St, Atlanta, GA 30301" />
              </div>
              <div className="form-group">
                <label>Customer Name</label>
                <input type="text" value={loc.customer_name} onChange={e => updateLocation(i, 'customer_name', e.target.value)} placeholder="John Smith" />
              </div>
              <div className="form-group">
                <label>Estimated Duration (minutes)</label>
                <input type="number" value={loc.estimated_duration_minutes} onChange={e => updateLocation(i, 'estimated_duration_minutes', e.target.value)} min="15" step="15" />
              </div>
            </div>
          ))}

          <button type="button" onClick={addLocation} className="btn" style={{ marginBottom: 12, width: '100%' }}>
            + Add Stop
          </button>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Optimizing...' : 'Optimize Route'}
          </button>
        </form>
      </div>

      {error && <div style={{ padding: 24 }}><div className="login-error">{error}</div></div>}

      {loading && (
        <div className="ai-loading">
          <p style={{ fontSize: 16, color: '#2e7d32', fontWeight: 600 }}>AI is optimizing your route...</p>
          <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        </div>
      )}

      {result && !loading && (
        <div className="ai-result-section">
          <h2 className="ai-section-title">Optimized Route</h2>

          {/* Summary metrics */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            {result.total_drive_time_minutes != null && (
              <div className="ai-metric">
                <span className="metric-value">{result.total_drive_time_minutes} min</span>
                <span className="metric-label">Total Drive Time</span>
              </div>
            )}
            {result.efficiency_improvement_percent != null && (
              <div className="ai-metric">
                <span className="metric-value" style={{ color: '#2e7d32' }}>+{result.efficiency_improvement_percent}%</span>
                <span className="metric-label">Efficiency Gain</span>
              </div>
            )}
            {result.total_distance_miles != null && (
              <div className="ai-metric">
                <span className="metric-value">{result.total_distance_miles} mi</span>
                <span className="metric-label">Total Distance</span>
              </div>
            )}
          </div>

          {/* Optimized sequence */}
          {result.optimized_sequence?.length > 0 && (
            <div className="ai-result-card">
              <h3>Optimized Stop Sequence</h3>
              <ol style={{ paddingLeft: 20 }}>
                {result.optimized_sequence.map((stop, i) => (
                  <li key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                    <strong>{stop.customer_name || stop.address || `Stop ${i + 1}`}</strong>
                    {stop.address && <p style={{ margin: '2px 0', color: '#555', fontSize: 13 }}>{stop.address}</p>}
                    {stop.estimated_arrival && <p style={{ margin: '2px 0', color: '#1565c0', fontSize: 13 }}>Arrival: {stop.estimated_arrival}</p>}
                    {stop.drive_time_from_previous && <p style={{ margin: '2px 0', color: '#777', fontSize: 12 }}>Drive from previous: {stop.drive_time_from_previous} min</p>}
                    {stop.notes && <p style={{ margin: '2px 0', color: '#666', fontSize: 12, fontStyle: 'italic' }}>{stop.notes}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tips / recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="ai-result-card">
              <h3>Route Tips</h3>
              <ul>{result.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          )}

          {result.notes && <div className="ai-highlight">{result.notes}</div>}
        </div>
      )}
    </div>
  );
}

export default RouteOptimizer;
