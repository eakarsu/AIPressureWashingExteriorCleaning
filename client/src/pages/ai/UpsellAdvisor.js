import React from 'react';
import AIFeature from '../AIFeature';

const inputFields = [
  { key: 'currentService', label: 'Current/Booked Service', type: 'select', options: ['House Wash', 'Roof Cleaning', 'Driveway Cleaning', 'Deck Restoration', 'Fence Cleaning', 'Gutter Cleaning', 'Window Cleaning', 'Commercial Building Wash', 'Parking Lot Cleaning'] },
  { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Single Family Home', 'Multi-Family', 'Townhouse/Condo', 'Commercial Building', 'Office Complex', 'Retail', 'Industrial'] },
  { key: 'customerType', label: 'Customer Type', type: 'select', options: ['New Customer', 'Repeat Customer', 'Annual Plan Member', 'Commercial Client', 'Referral'] },
  { key: 'propertyAge', label: 'Property Age', type: 'select', options: ['0-5 years', '5-15 years', '15-30 years', '30+ years'] },
  { key: 'lastServiceDate', label: 'Last Service Date', type: 'date' },
  { key: 'budget', label: 'Customer Budget Range', type: 'select', options: ['Budget Conscious', 'Mid-Range', 'Premium/No Concern', 'Unknown'] },
  { key: 'season', label: 'Current Season', type: 'select', options: ['Spring', 'Summer', 'Fall', 'Winter'] },
  { key: 'additionalNotes', label: 'Additional Context', type: 'textarea', placeholder: 'Any observations about the property, customer preferences, etc.' },
];

function formatResponse(data) {
  const result = data.data || data.result || data;

  return (
    <div>
      {/* Top upsell recommendations */}
      {result.recommendations && (
        <div className="ai-result-card">
          <h3>Upsell Recommendations</h3>
          {Array.isArray(result.recommendations) ? (
            result.recommendations.map((rec, i) => (
              <div key={i} style={{
                padding: 16,
                background: i === 0 ? '#e8f5e9' : 'white',
                border: `1px solid ${i === 0 ? '#66bb6a' : '#e8eaf6'}`,
                borderRadius: 10,
                marginBottom: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ fontSize: 16, color: '#1a237e' }}>
                    {i === 0 && <span className="ai-badge" style={{ marginRight: 8 }}>Top Pick</span>}
                    {typeof rec === 'string' ? rec : rec.service || rec.name}
                  </strong>
                  {rec.additionalRevenue && (
                    <span style={{ fontWeight: 700, color: '#2e7d32', fontSize: 18 }}>
                      +${rec.additionalRevenue}
                    </span>
                  )}
                </div>
                {rec.reason && <p style={{ color: '#555', marginBottom: 4 }}>{rec.reason}</p>}
                {rec.pitch && (
                  <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 6, fontSize: 13, fontStyle: 'italic', marginTop: 8 }}>
                    Suggested Pitch: "{rec.pitch}"
                  </div>
                )}
                {rec.conversionRate && (
                  <span style={{ fontSize: 12, color: '#7986cb', marginTop: 8, display: 'inline-block' }}>
                    Estimated conversion rate: {rec.conversionRate}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{typeof result.recommendations === 'string' ? result.recommendations : JSON.stringify(result.recommendations, null, 2)}</p>
          )}
        </div>
      )}

      {/* Revenue potential */}
      {result.totalPotentialRevenue && (
        <div className="ai-result-card">
          <h3>Revenue Potential</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div className="ai-metric">
              <span className="metric-value">${result.totalPotentialRevenue}</span>
              <span className="metric-label">Total Upsell Potential</span>
            </div>
            {result.expectedConversion && (
              <div className="ai-metric">
                <span className="metric-value">${result.expectedConversion}</span>
                <span className="metric-label">Expected Revenue</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bundling suggestions */}
      {result.bundles && (
        <div className="ai-result-card">
          <h3>Bundle Suggestions</h3>
          {Array.isArray(result.bundles) ? (
            result.bundles.map((b, i) => (
              <div key={i} style={{ padding: 12, border: '1px solid #e8eaf6', borderRadius: 8, marginBottom: 8 }}>
                <strong>{typeof b === 'string' ? b : b.name}</strong>
                {b.discount && <span className="ai-badge" style={{ marginLeft: 8, background: '#ff6f00' }}>Save {b.discount}</span>}
                {b.services && <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Includes: {Array.isArray(b.services) ? b.services.join(', ') : b.services}</p>}
                {b.price && <p style={{ fontWeight: 700, color: '#2e7d32' }}>${b.price}</p>}
              </div>
            ))
          ) : (
            <p>{result.bundles}</p>
          )}
        </div>
      )}

      {/* Seasonal suggestions */}
      {result.seasonalSuggestions && (
        <div className="ai-result-card">
          <h3>Seasonal Opportunities</h3>
          {Array.isArray(result.seasonalSuggestions) ? (
            <ul>{result.seasonalSuggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
          ) : (
            <p>{result.seasonalSuggestions}</p>
          )}
        </div>
      )}

      {/* Talking points */}
      {result.talkingPoints && (
        <div className="ai-result-card">
          <h3>Talking Points for Crew</h3>
          {Array.isArray(result.talkingPoints) ? (
            <ol style={{ paddingLeft: 20 }}>
              {result.talkingPoints.map((t, i) => <li key={i} style={{ marginBottom: 6, lineHeight: 1.7 }}>{t}</li>)}
            </ol>
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{result.talkingPoints}</p>
          )}
        </div>
      )}

      {result.notes && <div className="ai-highlight">{result.notes}</div>}
      {result.timing && <div className="ai-highlight"><strong>Best Time to Pitch:</strong> {result.timing}</div>}
    </div>
  );
}

function UpsellAdvisor() {
  return (
    <AIFeature
      title="AI Upsell Advisor"
      icon="💡"
      apiEndpoint="/ai/upsell-suggestions"
      inputFields={inputFields}
      formatResponse={formatResponse}
    />
  );
}

export default UpsellAdvisor;
