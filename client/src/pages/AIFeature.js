import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AIFeature({ title, icon, apiEndpoint, inputFields, formatResponse }) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    inputFields.forEach((f) => { initial[f.key] = f.defaultValue || ''; });
    return initial;
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post(apiEndpoint, formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'AI processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDefaultResponse = (data) => {
    if (!data) return null;

    // Handle string response - try to parse JSON, otherwise render as formatted text
    if (typeof data === 'string') {
      // Try to extract JSON from the string (AI sometimes wraps JSON in markdown code blocks)
      let parsed = null;
      try {
        const jsonMatch = data.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, data];
        parsed = JSON.parse(jsonMatch[1].trim());
      } catch {
        // Not JSON, render as formatted text
        const sections = data.split(/\n(?=#{1,3}\s|\*\*[^*]+\*\*:|\d+\.\s)/);
        return (
          <div>
            {sections.map((section, i) => {
              const trimmed = section.trim();
              if (!trimmed) return null;
              // Check for headers
              const headerMatch = trimmed.match(/^#{1,3}\s+(.+)/);
              if (headerMatch) {
                return (
                  <div className="ai-result-card" key={i}>
                    <h3>{headerMatch[1]}</h3>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                      {trimmed.replace(/^#{1,3}\s+.+\n?/, '')}
                    </p>
                  </div>
                );
              }
              return (
                <div className="ai-result-card" key={i}>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{trimmed}</p>
                </div>
              );
            })}
          </div>
        );
      }
      if (parsed) {
        data = parsed;
      }
    }

    // Handle object response - render beautifully
    const renderValue = (value, depth = 0) => {
      if (value === null || value === undefined) return <span>-</span>;
      if (typeof value === 'boolean') return <span className="ai-badge">{value ? 'Yes' : 'No'}</span>;
      if (typeof value === 'number') return <strong>{value}</strong>;
      if (typeof value === 'string') return <span style={{ whiteSpace: 'pre-wrap' }}>{value}</span>;

      if (Array.isArray(value)) {
        return (
          <ul style={{ listStyle: depth === 0 ? 'disc' : 'circle' }}>
            {value.map((item, i) => (
              <li key={i}>{typeof item === 'object' ? renderValue(item, depth + 1) : String(item)}</li>
            ))}
          </ul>
        );
      }

      if (typeof value === 'object') {
        return (
          <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
            {Object.entries(value).map(([k, v]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <strong style={{ color: '#1a237e', textTransform: 'capitalize' }}>
                  {k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:
                </strong>{' '}
                {renderValue(v, depth + 1)}
              </div>
            ))}
          </div>
        );
      }

      return <span>{String(value)}</span>;
    };

    // Try to extract common AI response patterns
    const response = data.estimate || data.recommendation || data.schedule || data.content || data.suggestions || data.data || data.result || data;
    // If response is a string, try to parse it
    if (typeof response === 'string') {
      return renderDefaultResponse(response);
    }
    const topLevelKeys = Object.keys(response);

    return (
      <div>
        {topLevelKeys.map((key) => {
          const val = response[key];
          const label = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ');

          // Skip metadata fields
          if (['success', 'status', 'timestamp', '__v'].includes(key)) return null;

          // Special rendering for certain patterns
          if (typeof val === 'string' && val.length > 100) {
            return (
              <div className="ai-result-card" key={key}>
                <h3 style={{ textTransform: 'capitalize' }}>{label}</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{val}</p>
              </div>
            );
          }

          if (typeof val === 'number' && (key.includes('price') || key.includes('cost') || key.includes('total') || key.includes('estimate'))) {
            return (
              <div className="ai-metric" key={key}>
                <span className="metric-value">${val.toFixed(2)}</span>
                <span className="metric-label">{label}</span>
              </div>
            );
          }

          if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
            return (
              <div className="ai-result-card" key={key}>
                <h3 style={{ textTransform: 'capitalize' }}>{label}</h3>
                <ul>
                  {val.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            );
          }

          return (
            <div className="ai-result-card" key={key}>
              <h3 style={{ textTransform: 'capitalize' }}>{label}</h3>
              {renderValue(val)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ai-page">
      <div className="feature-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>
            {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
            {title}
          </h1>
        </div>
        <span className="ai-badge">AI Powered</span>
      </div>

      <div className="ai-input-section">
        <h3>Input Parameters</h3>
        <form onSubmit={handleSubmit}>
          {inputFields.map((field) => (
            <div className="form-group" key={field.key}>
              <label>{field.label}</label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                >
                  <option value="">Select {field.label}</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-success" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Processing...' : 'Generate AI Response'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ padding: 24 }}>
          <div className="login-error">{error}</div>
        </div>
      )}

      {loading && (
        <div className="ai-loading">
          <p style={{ fontSize: 16, color: '#2e7d32', fontWeight: 600 }}>AI is analyzing your request...</p>
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="ai-result-section">
          <h2 className="ai-section-title">AI Results</h2>
          {formatResponse ? formatResponse(result) : renderDefaultResponse(result)}
        </div>
      )}
    </div>
  );
}

export default AIFeature;
