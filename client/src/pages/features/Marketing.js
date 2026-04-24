import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'name', label: 'Campaign' },
  { key: 'campaign_type', label: 'Type' },
  { key: 'channel', label: 'Channel' },
  { key: 'budget', label: 'Budget', type: 'currency' },
  { key: 'leads_generated', label: 'Leads' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'name', label: 'Campaign Name', placeholder: 'Spring Cleaning Special' },
  { key: 'campaign_type', label: 'Campaign Type', type: 'select', options: ['seasonal', 'referral', 'discount', 'awareness', 'retention', 'launch'] },
  { key: 'channel', label: 'Channel', type: 'select', options: ['Google Ads', 'Facebook', 'Instagram', 'Direct Mail', 'Door Hangers', 'Yard Signs', 'Email', 'SMS', 'Nextdoor'] },
  { key: 'target_audience', label: 'Target Audience', placeholder: 'Homeowners 35-65' },
  { key: 'budget', label: 'Budget', type: 'number', placeholder: '0.00' },
  { key: 'spent', label: 'Amount Spent', type: 'number', placeholder: '0.00' },
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'impressions', label: 'Impressions', type: 'number' },
  { key: 'clicks', label: 'Clicks', type: 'number' },
  { key: 'leads_generated', label: 'Leads Generated', type: 'number' },
  { key: 'conversions', label: 'Conversions', type: 'number' },
  { key: 'revenue_generated', label: 'Revenue Generated', type: 'number' },
  { key: 'promo_code', label: 'Promo Code', placeholder: 'SPRING20' },
  { key: 'status', label: 'Status', type: 'select', options: ['draft', 'active', 'paused', 'completed', 'cancelled'] },
  { key: 'description', label: 'Description', type: 'textarea' },
];

function Marketing() {
  return (
    <GenericFeature
      title="Marketing Campaigns"
      icon="📣"
      apiEndpoint="/marketing"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Marketing;
