import CompleteAIExamples, { AIRequiredButton } from "../components/CompleteAIExamples";
import AIReport from '../components/AIReport';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AIFeature({ title, icon, apiEndpoint, inputFields }) {
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
        <CompleteAIExamples busy={loading} context="Exterior cleaning planning"><form onSubmit={handleSubmit}>
          {inputFields.map((field) => (
            <div className="form-group" key={field.key}>
              <label>{field.label}</label>
              {field.type === 'select' ? (
                <select data-ai-field={field.key}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                >
                  <option value="">Select {field.label}</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea data-ai-field={field.key}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                />
              ) : (
                <input data-ai-field={field.key}
                  type={field.type || 'text'}
                  value={formData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                />
              )}
            </div>
          ))}
          <AIRequiredButton data-ai-generate type="submit" className="btn btn-success" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Processing...' : 'Generate AI Response'}
          </AIRequiredButton>
        </form></CompleteAIExamples>
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
          <AIReport response={result} title={title} />
        </div>
      )}
    </div>
  );
}

export default AIFeature;
