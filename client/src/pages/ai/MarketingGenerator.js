import React from 'react';
import AIFeature from '../AIFeature';

const inputFields = [
  { key: 'contentType', label: 'Content Type', type: 'select', options: ['Social Media Post', 'Google Ad', 'Facebook Ad', 'Email Campaign', 'Door Hanger Text', 'Website Copy', 'Blog Post Outline', 'Seasonal Promotion', 'Review Response', 'SMS Marketing'] },
  { key: 'targetService', label: 'Target Service', type: 'select', options: ['House Washing', 'Roof Cleaning', 'Driveway/Concrete', 'Deck Restoration', 'Commercial Services', 'Gutter Cleaning', 'All Services', 'Seasonal Package'] },
  { key: 'targetAudience', label: 'Target Audience', type: 'select', options: ['Homeowners', 'Property Managers', 'Real Estate Agents', 'Commercial Business Owners', 'HOA Boards', 'New Homeowners', 'Repeat Customers'] },
  { key: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Friendly/Casual', 'Urgent/Limited Time', 'Educational', 'Luxury/Premium', 'Community-Focused'] },
  { key: 'promotionDetails', label: 'Promotion / Offer', placeholder: 'e.g. 20% off first service, free driveway with house wash, etc.' },
  { key: 'companyName', label: 'Company Name', placeholder: 'Your business name' },
  { key: 'serviceArea', label: 'Service Area', placeholder: 'e.g. Greater Austin, TX area' },
  { key: 'additionalInfo', label: 'Additional Info', type: 'textarea', placeholder: 'Any specific points to include, unique selling propositions, etc.' },
];

function formatResponse(data) {
  const result = data.data || data.result || data;

  return (
    <div>
      {/* Generated content */}
      {result.content && (
        <div className="ai-result-card">
          <h3>Generated Content</h3>
          <div style={{ background: 'white', border: '1px solid #c8e6c9', borderRadius: 8, padding: 20, whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: 15 }}>
            {result.content}
          </div>
        </div>
      )}

      {/* Headlines */}
      {result.headlines && (
        <div className="ai-result-card">
          <h3>Headlines / Subject Lines</h3>
          {Array.isArray(result.headlines) ? (
            result.headlines.map((h, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'white', border: '1px solid #e8eaf6', borderRadius: 6, marginBottom: 8, fontWeight: 600, fontSize: 15 }}>
                {i + 1}. {h}
              </div>
            ))
          ) : (
            <p>{result.headlines}</p>
          )}
        </div>
      )}

      {/* Call to action */}
      {result.callToAction && (
        <div className="ai-result-card">
          <h3>Call to Action</h3>
          {Array.isArray(result.callToAction) ? (
            <div>{result.callToAction.map((c, i) => <span className="ai-badge" key={i} style={{ fontSize: 14, padding: '8px 16px', margin: 6 }}>{c}</span>)}</div>
          ) : (
            <div className="ai-highlight"><strong>{result.callToAction}</strong></div>
          )}
        </div>
      )}

      {/* Hashtags */}
      {result.hashtags && (
        <div className="ai-result-card">
          <h3>Suggested Hashtags</h3>
          <div>
            {Array.isArray(result.hashtags) ? (
              result.hashtags.map((h, i) => <span key={i} className="ai-badge" style={{ background: '#1565c0', margin: 4 }}>{h}</span>)
            ) : (
              <p>{result.hashtags}</p>
            )}
          </div>
        </div>
      )}

      {/* Variations */}
      {result.variations && (
        <div className="ai-result-card">
          <h3>Content Variations</h3>
          {Array.isArray(result.variations) ? (
            result.variations.map((v, i) => (
              <div key={i} style={{ padding: 16, background: 'white', border: '1px solid #e8eaf6', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ fontWeight: 600, color: '#1a237e', marginBottom: 4 }}>Variation {i + 1}</div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{typeof v === 'string' ? v : v.text || v.content}</p>
              </div>
            ))
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{result.variations}</p>
          )}
        </div>
      )}

      {/* Tips */}
      {result.tips && (
        <div className="ai-result-card">
          <h3>Marketing Tips</h3>
          {Array.isArray(result.tips) ? (
            <ul>{result.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
          ) : (
            <p>{result.tips}</p>
          )}
        </div>
      )}

      {result.notes && <div className="ai-highlight">{result.notes}</div>}
    </div>
  );
}

function MarketingGenerator() {
  return (
    <AIFeature
      title="AI Marketing Generator"
      icon="✨"
      apiEndpoint="/ai/marketing-content"
      inputFields={inputFields}
      formatResponse={formatResponse}
    />
  );
}

export default MarketingGenerator;
