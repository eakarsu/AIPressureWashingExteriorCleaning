import React from 'react';
import AIFeature from '../AIFeature';

const inputFields = [
  { key: 'property_type', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Industrial', 'HOA/Community', 'Government'] },
  { key: 'surface_area', label: 'Surface Area (sq ft)', type: 'number', placeholder: '2500' },
  { key: 'contamination_level', label: 'Contamination Level', type: 'select', options: ['light', 'moderate', 'heavy', 'extreme'] },
  { key: 'location', label: 'Location / City', type: 'text', placeholder: 'e.g. Atlanta, GA' },
  { key: 'surfaces', label: 'Surfaces to Clean', type: 'textarea', placeholder: 'e.g. driveway, siding, roof, deck' },
  { key: 'special_requirements', label: 'Special Requirements', type: 'textarea', placeholder: 'e.g. eco-friendly chemicals, height restrictions' },
];

function formatResponse(data) {
  const result = data.data || data.quote || data;
  const renderSection = (title, content) => {
    if (!content) return null;
    return (
      <div className="ai-result-card" key={title}>
        <h3>{title}</h3>
        {Array.isArray(content) ? (
          <ul>{content.map((item, i) => <li key={i}>{typeof item === 'string' ? item : `${item.description || item.item}: $${item.cost || item.amount || item.price || 0}`}</li>)}</ul>
        ) : typeof content === 'object' ? (
          <p style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(content, null, 2)}</p>
        ) : (
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{content}</p>
        )}
      </div>
    );
  };

  if (typeof result === 'string') {
    return <div className="ai-result-card"><h3>Quote</h3><p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{result}</p></div>;
  }

  return (
    <div>
      {(result.subtotal || result.total) && (
        <div className="ai-result-card">
          <h3>Pricing Summary</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {result.subtotal && <div className="ai-metric"><span className="metric-value">${Number(result.subtotal).toFixed(2)}</span><span className="metric-label">Subtotal</span></div>}
            {result.labor && <div className="ai-metric"><span className="metric-value">${Number(result.labor).toFixed(2)}</span><span className="metric-label">Labor</span></div>}
            {result.materials && <div className="ai-metric"><span className="metric-value">${Number(result.materials).toFixed(2)}</span><span className="metric-label">Materials</span></div>}
            {result.equipment && <div className="ai-metric"><span className="metric-value">${Number(result.equipment).toFixed(2)}</span><span className="metric-label">Equipment</span></div>}
            {result.total && <div className="ai-metric"><span className="metric-value" style={{ color: '#2e7d32' }}>${Number(result.total).toFixed(2)}</span><span className="metric-label">Total</span></div>}
          </div>
        </div>
      )}
      {renderSection('Line Items', result.line_items)}
      {renderSection('Cost Reduction Opportunities', result.cost_reduction_opportunities)}
      {renderSection('Critical Investments', result.critical_investments)}
      {renderSection('Assumptions', result.assumptions)}
      {renderSection('Notes', result.notes)}
    </div>
  );
}

function QuoteGenerator() {
  return (
    <AIFeature
      title="AI Quote Generator"
      icon="💰"
      apiEndpoint="/ai/generate-quote"
      inputFields={inputFields}
      formatResponse={formatResponse}
    />
  );
}

export default QuoteGenerator;
