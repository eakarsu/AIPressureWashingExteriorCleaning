import React from 'react';
import AIFeature from '../AIFeature';

const inputFields = [
  { key: 'surfaceType', label: 'Surface Type', type: 'select', options: ['Vinyl Siding', 'Brick', 'Stucco', 'Wood/Cedar', 'Stone/Flagstone', 'Concrete', 'Asphalt', 'Metal', 'EIFS', 'Tile Roof', 'Asphalt Shingle Roof', 'Composite Deck'] },
  { key: 'contaminant', label: 'Contaminant / Stain Type', type: 'select', options: ['Algae/Green Growth', 'Black Mold/Mildew', 'Rust Stains', 'Oil/Grease', 'Efflorescence', 'Hard Water Deposits', 'Oxidation', 'Organic Staining', 'Paint Overspray', 'General Dirt/Grime', 'Moss/Lichen'] },
  { key: 'severity', label: 'Contamination Severity', type: 'select', options: ['Light', 'Moderate', 'Heavy', 'Extreme/Years of Buildup'] },
  { key: 'areaSize', label: 'Area Size (sq ft)', type: 'number', placeholder: 'Approximate area' },
  { key: 'nearVegetation', label: 'Near Vegetation/Landscaping?', type: 'select', options: ['Yes - Close proximity', 'Yes - Some nearby', 'No - Clear area'] },
  { key: 'waterSource', label: 'Water Runoff Concerns', type: 'select', options: ['None', 'Storm drain nearby', 'Near water body', 'Sensitive area'] },
  { key: 'additionalInfo', label: 'Additional Information', type: 'textarea', placeholder: 'Any special concerns, previous treatments, etc.' },
];

function formatResponse(data) {
  const result = data.data || data.result || data;

  return (
    <div>
      {/* Primary recommendation */}
      {result.primaryChemical && (
        <div className="ai-result-card">
          <h3>Primary Chemical Recommendation</h3>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#2e7d32', marginBottom: 12 }}>
            {result.primaryChemical.name || result.primaryChemical}
          </p>
          {result.primaryChemical.dilutionRatio && (
            <div className="ai-highlight">
              Dilution Ratio: <strong>{result.primaryChemical.dilutionRatio}</strong>
            </div>
          )}
          {result.primaryChemical.applicationMethod && (
            <p><strong>Application Method:</strong> {result.primaryChemical.applicationMethod}</p>
          )}
          {result.primaryChemical.dwellTime && (
            <p><strong>Dwell Time:</strong> {result.primaryChemical.dwellTime}</p>
          )}
        </div>
      )}

      {/* Chemical mix */}
      {result.chemicalMix && (
        <div className="ai-result-card">
          <h3>Recommended Chemical Mix</h3>
          {Array.isArray(result.chemicalMix) ? (
            <ul>{result.chemicalMix.map((c, i) => <li key={i}><strong>{c.chemical || c.name || c}:</strong> {c.amount || c.ratio || ''}</li>)}</ul>
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{typeof result.chemicalMix === 'string' ? result.chemicalMix : JSON.stringify(result.chemicalMix, null, 2)}</p>
          )}
        </div>
      )}

      {/* Application steps */}
      {result.applicationSteps && (
        <div className="ai-result-card">
          <h3>Application Steps</h3>
          {Array.isArray(result.applicationSteps) ? (
            <ol style={{ paddingLeft: 20 }}>
              {result.applicationSteps.map((step, i) => (
                <li key={i} style={{ marginBottom: 8, lineHeight: 1.7 }}>{step}</li>
              ))}
            </ol>
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{result.applicationSteps}</p>
          )}
        </div>
      )}

      {/* Safety precautions */}
      {result.safetyPrecautions && (
        <div className="ai-result-card" style={{ borderColor: '#ffcdd2', background: 'linear-gradient(135deg, #fff5f5 0%, #ffebee 100%)' }}>
          <h3 style={{ color: '#c62828' }}>Safety Precautions</h3>
          {Array.isArray(result.safetyPrecautions) ? (
            <ul>{result.safetyPrecautions.map((s, i) => <li key={i}>{s}</li>)}</ul>
          ) : (
            <p>{result.safetyPrecautions}</p>
          )}
        </div>
      )}

      {/* Environmental notes */}
      {result.environmentalNotes && (
        <div className="ai-result-card">
          <h3>Environmental Considerations</h3>
          {Array.isArray(result.environmentalNotes) ? (
            <ul>{result.environmentalNotes.map((n, i) => <li key={i}>{n}</li>)}</ul>
          ) : (
            <p>{result.environmentalNotes}</p>
          )}
        </div>
      )}

      {/* Estimated quantities */}
      {result.estimatedQuantities && (
        <div className="ai-result-card">
          <h3>Estimated Quantities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {typeof result.estimatedQuantities === 'object' && !Array.isArray(result.estimatedQuantities) ? (
              Object.entries(result.estimatedQuantities).map(([k, v]) => (
                <div className="ai-metric" key={k}>
                  <span className="metric-value">{v}</span>
                  <span className="metric-label">{k.replace(/([A-Z])/g, ' $1')}</span>
                </div>
              ))
            ) : (
              <p>{JSON.stringify(result.estimatedQuantities)}</p>
            )}
          </div>
        </div>
      )}

      {result.alternatives && (
        <div className="ai-result-card">
          <h3>Alternative Options</h3>
          {Array.isArray(result.alternatives) ? (
            <ul>{result.alternatives.map((a, i) => <li key={i}>{typeof a === 'string' ? a : `${a.name}: ${a.description || a.notes || ''}`}</li>)}</ul>
          ) : (
            <p>{result.alternatives}</p>
          )}
        </div>
      )}

      {result.notes && <div className="ai-highlight">{result.notes}</div>}
      {result.warnings && <div className="ai-highlight">{Array.isArray(result.warnings) ? result.warnings.join('. ') : result.warnings}</div>}
    </div>
  );
}

function ChemicalAdvisor() {
  return (
    <AIFeature
      title="AI Chemical Advisor"
      icon="🧬"
      apiEndpoint="/ai/chemical-recommendation"
      inputFields={inputFields}
      formatResponse={formatResponse}
    />
  );
}

export default ChemicalAdvisor;
