import React from 'react';
import AIFeature from '../AIFeature';

const inputFields = [
  { key: 'location', label: 'Location / ZIP Code', placeholder: 'City, State or ZIP code' },
  { key: 'serviceType', label: 'Service Type', type: 'select', options: ['House Wash', 'Roof Cleaning', 'Concrete Cleaning', 'Deck Restoration', 'Commercial Wash', 'Painting Prep', 'Sealing/Coating', 'Window Cleaning'] },
  { key: 'preferredDateRange', label: 'Preferred Date Range', placeholder: 'e.g. Next 2 weeks, March 2026' },
  { key: 'crewAvailability', label: 'Crew Availability', type: 'select', options: ['Weekdays Only', 'Weekends Only', 'Any Day', 'Mon-Sat', 'Specific Days'] },
  { key: 'timePreference', label: 'Time Preference', type: 'select', options: ['Early Morning (6-9 AM)', 'Morning (8-12 PM)', 'Afternoon (12-4 PM)', 'Full Day', 'Flexible'] },
  { key: 'jobDuration', label: 'Estimated Job Duration', type: 'select', options: ['1-2 hours', '2-4 hours', '4-6 hours', 'Full Day', 'Multi-Day'] },
  { key: 'weatherSensitivity', label: 'Weather Sensitivity', type: 'select', options: ['Low - Can work in light rain', 'Medium - Need dry conditions', 'High - Need dry + specific temp range', 'Critical - Sealing/coating work'] },
  { key: 'additionalNotes', label: 'Additional Notes', type: 'textarea', placeholder: 'Any scheduling constraints or preferences' },
];

function formatResponse(data) {
  const result = data.data || data.result || data;

  return (
    <div>
      {/* Best dates */}
      {result.recommendedDates && (
        <div className="ai-result-card">
          <h3>Recommended Dates</h3>
          {Array.isArray(result.recommendedDates) ? (
            result.recommendedDates.map((d, i) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < result.recommendedDates.length - 1 ? '1px solid #c8e6c9' : 'none' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#2e7d32' }}>
                  {i === 0 && <span className="ai-badge" style={{ marginRight: 8 }}>Best Choice</span>}
                  {typeof d === 'string' ? d : d.date}
                </div>
                {d.reason && <p style={{ marginTop: 4, color: '#555' }}>{d.reason}</p>}
                {d.weather && <p style={{ color: '#666' }}>Weather: {d.weather}</p>}
                {d.temperature && <p style={{ color: '#666' }}>Temperature: {d.temperature}</p>}
              </div>
            ))
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{typeof result.recommendedDates === 'string' ? result.recommendedDates : JSON.stringify(result.recommendedDates, null, 2)}</p>
          )}
        </div>
      )}

      {/* Weather forecast */}
      {result.weatherForecast && (
        <div className="ai-result-card">
          <h3>Weather Outlook</h3>
          {Array.isArray(result.weatherForecast) ? (
            result.weatherForecast.map((w, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8eaf6' }}>
                <span style={{ fontWeight: 600 }}>{w.date || w.day}</span>
                <span>{w.condition || w.weather}</span>
                <span>{w.temperature || w.temp}</span>
                <span>{w.precipitation || w.rain || ''}</span>
              </div>
            ))
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{typeof result.weatherForecast === 'string' ? result.weatherForecast : JSON.stringify(result.weatherForecast, null, 2)}</p>
          )}
        </div>
      )}

      {/* Dates to avoid */}
      {result.datesToAvoid && (
        <div className="ai-result-card" style={{ borderColor: '#ffcdd2', background: 'linear-gradient(135deg, #fff5f5 0%, #ffebee 100%)' }}>
          <h3 style={{ color: '#c62828' }}>Dates to Avoid</h3>
          {Array.isArray(result.datesToAvoid) ? (
            <ul>{result.datesToAvoid.map((d, i) => <li key={i}>{typeof d === 'string' ? d : `${d.date}: ${d.reason}`}</li>)}</ul>
          ) : (
            <p>{result.datesToAvoid}</p>
          )}
        </div>
      )}

      {/* Scheduling tips */}
      {result.tips && (
        <div className="ai-result-card">
          <h3>Scheduling Tips</h3>
          {Array.isArray(result.tips) ? (
            <ul>{result.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{result.tips}</p>
          )}
        </div>
      )}

      {result.notes && <div className="ai-highlight">{result.notes}</div>}
      {result.recommendation && (
        <div className="ai-highlight">
          <strong>AI Recommendation:</strong> {result.recommendation}
        </div>
      )}
    </div>
  );
}

function WeatherScheduler() {
  return (
    <AIFeature
      title="AI Weather Scheduler"
      icon="⛅"
      apiEndpoint="/ai/weather-scheduling"
      inputFields={inputFields}
      formatResponse={formatResponse}
    />
  );
}

export default WeatherScheduler;
