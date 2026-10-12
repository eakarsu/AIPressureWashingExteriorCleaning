import React, { useState } from 'react';
import AIReport from '../../components/AIReport';
import CompleteAIExamples from '../../components/CompleteAIExamples';
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
        <CompleteAIExamples busy={loading} context="Exterior cleaning scheduling"><form onSubmit={handleSubmit}>
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
        </form></CompleteAIExamples>
      </div>

      {error && <div style={{ padding: 24 }}><div className="login-error">{error}</div></div>}

      {loading && (
        <div className="ai-loading">
          <p style={{ fontSize: 16, color: '#2e7d32', fontWeight: 600 }}>AI is optimizing your route...</p>
          <div className="dots"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        </div>
      )}

      {result !== null && !loading && <div className="ai-result-section"><AIReport response={result} title="Optimized route" /></div>}
    </div>
  );
}

export default RouteOptimizer;
