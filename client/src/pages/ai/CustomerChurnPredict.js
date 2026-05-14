import React from 'react';
import AIFeature from '../AIFeature';

const inputFields = [
  {
    key: 'lookback_days',
    label: 'Lookback Window (days)',
    type: 'number',
    placeholder: '180',
    defaultValue: 180,
  },
  {
    key: 'min_jobs',
    label: 'Min Jobs to Include Customer',
    type: 'number',
    placeholder: '1',
    defaultValue: 1,
  },
  {
    key: 'notes',
    label: 'Notes / Context',
    type: 'textarea',
    placeholder: 'Recent campaign, pricing changes, weather impacts...',
  },
];

function CustomerChurnPredict() {
  return (
    <AIFeature
      title="Customer Churn Predictor"
      icon="📉"
      apiEndpoint="/ai/customer-churn-predict"
      inputFields={inputFields}
    />
  );
}

export default CustomerChurnPredict;
