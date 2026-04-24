import React from 'react';
import AIFeature from '../AIFeature';

const inputFields = [
  { key: 'property_type', label: 'Property Type', type: 'select', options: ['Single Family Home', 'Multi-Family', 'Commercial Building', 'Office Complex', 'Retail Store', 'Industrial', 'HOA/Community'] },
  { key: 'square_footage', label: 'Square Footage', type: 'number', placeholder: 'Total area to clean' },
  { key: 'services', label: 'Services', type: 'select', options: ['House Wash', 'Roof Cleaning', 'Driveway/Sidewalk', 'Deck Restoration', 'Fence Cleaning', 'Commercial Building', 'Parking Lot', 'Fleet Washing', 'Gutter Cleaning', 'Window Cleaning'] },
  { key: 'surface_type', label: 'Surface Type', type: 'select', options: ['Vinyl Siding', 'Brick', 'Stucco', 'Wood', 'Stone', 'Concrete', 'Metal', 'Composite', 'Mixed'] },
  { key: 'condition', label: 'Condition / Soil Level', type: 'select', options: ['Light', 'Moderate', 'Heavy', 'Extreme'] },
  { key: 'num_stories', label: 'Number of Stories', type: 'select', options: ['1', '2', '3', '4+'] },
  { key: 'additional_details', label: 'Additional Details', type: 'textarea', placeholder: 'Any special considerations, obstacles, or specific areas to clean' },
];

function renderTextResponse(text) {
  const sections = text.split(/\n(?=#{1,3}\s|[A-Z][A-Za-z\s]+:|\*\*[A-Z])/);
  if (sections.length <= 1) {
    return (
      <div className="ai-result-card">
        <h3>Quote Estimate</h3>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{text}</p>
      </div>
    );
  }
  return sections.map((section, i) => {
    const trimmed = section.trim();
    if (!trimmed) return null;
    const headerMatch = trimmed.match(/^(?:#{1,3}\s*)?(.+?)[\n:]/);
    const header = headerMatch ? headerMatch[1].replace(/[#*]/g, '').trim() : null;
    const body = header ? trimmed.slice(trimmed.indexOf('\n') + 1).trim() || trimmed.slice(trimmed.indexOf(':') + 1).trim() : trimmed;
    return (
      <div className="ai-result-card" key={i}>
        {header && <h3>{header}</h3>}
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{body}</p>
      </div>
    );
  });
}

function renderParsedJSON(result) {
  return (
    <div>
      {/* Price estimate card */}
      <div className="ai-result-card">
        <h3>Estimated Quote</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {result.estimatedPrice && (
            <div className="ai-metric">
              <span className="metric-value">${typeof result.estimatedPrice === 'object' ? `${result.estimatedPrice.low || 0} - ${result.estimatedPrice.high || 0}` : Number(result.estimatedPrice).toFixed(2)}</span>
              <span className="metric-label">Estimated Price</span>
            </div>
          )}
          {result.laborHours && (
            <div className="ai-metric">
              <span className="metric-value">{result.laborHours}</span>
              <span className="metric-label">Labor Hours</span>
            </div>
          )}
          {result.crewSize && (
            <div className="ai-metric">
              <span className="metric-value">{result.crewSize}</span>
              <span className="metric-label">Crew Size</span>
            </div>
          )}
        </div>
      </div>

      {result.breakdown && (
        <div className="ai-result-card">
          <h3>Cost Breakdown</h3>
          {Array.isArray(result.breakdown) ? (
            <ul>
              {result.breakdown.map((item, i) => (
                <li key={i}>{typeof item === 'string' ? item : `${item.item || item.name}: $${item.cost || item.amount}`}</li>
              ))}
            </ul>
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result.breakdown, null, 2)}</p>
          )}
        </div>
      )}

      {result.recommendations && (
        <div className="ai-result-card">
          <h3>Recommendations</h3>
          {Array.isArray(result.recommendations) ? (
            <ul>{result.recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{result.recommendations}</p>
          )}
        </div>
      )}

      {result.equipmentNeeded && (
        <div className="ai-result-card">
          <h3>Equipment Needed</h3>
          {Array.isArray(result.equipmentNeeded) ? (
            <div>{result.equipmentNeeded.map((e, i) => <span className="ai-badge" key={i}>{e}</span>)}</div>
          ) : (
            <p>{result.equipmentNeeded}</p>
          )}
        </div>
      )}

      {result.scopeOfWork && (
        <div className="ai-result-card">
          <h3>Scope of Work</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{result.scopeOfWork}</p>
        </div>
      )}

      {result.notes && <div className="ai-highlight">{result.notes}</div>}
      {result.warnings && (
        <div className="ai-highlight">{Array.isArray(result.warnings) ? result.warnings.join('. ') : result.warnings}</div>
      )}
    </div>
  );
}

function formatResponse(data) {
  // data is res.data from axios, e.g. { estimate: "AI text response" }
  const rawText = data.estimate || data.data || data.result || '';

  if (typeof rawText === 'string') {
    try {
      const parsed = JSON.parse(rawText);
      if (typeof parsed === 'object' && parsed !== null) {
        return renderParsedJSON(parsed);
      }
    } catch (e) {
      // Not JSON, render as formatted text
    }
    return <div>{renderTextResponse(rawText)}</div>;
  }

  // If already an object
  if (typeof rawText === 'object' && rawText !== null) {
    return renderParsedJSON(rawText);
  }

  return (
    <div className="ai-result-card">
      <h3>Quote Estimate</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{String(rawText)}</p>
    </div>
  );
}

function QuoteEstimator() {
  return (
    <AIFeature
      title="AI Quote Estimator"
      icon="🤖"
      apiEndpoint="/ai/quote-estimate"
      inputFields={inputFields}
      formatResponse={formatResponse}
    />
  );
}

export default QuoteEstimator;
