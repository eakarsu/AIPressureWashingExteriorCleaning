import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'policy_type', label: 'Policy Type' },
  { key: 'provider', label: 'Provider' },
  { key: 'policy_number', label: 'Policy #' },
  { key: 'end_date', label: 'Expires', type: 'date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'policy_type', label: 'Policy Type', type: 'select', options: ['General Liability', 'Workers Compensation', 'Commercial Auto', 'Umbrella', 'Professional Liability', 'Equipment Coverage', 'Pollution Liability'] },
  { key: 'provider', label: 'Insurance Provider', placeholder: 'Provider name' },
  { key: 'policy_number', label: 'Policy Number', placeholder: 'POL-12345' },
  { key: 'coverage_amount', label: 'Coverage Amount', type: 'number', placeholder: '0.00' },
  { key: 'deductible', label: 'Deductible', type: 'number', placeholder: '0.00' },
  { key: 'premium_monthly', label: 'Monthly Premium', type: 'number', placeholder: '0.00' },
  { key: 'premium_annual', label: 'Annual Premium', type: 'number', placeholder: '0.00' },
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'expiring_soon', 'expired', 'pending_renewal'] },
  { key: 'agent_name', label: 'Agent Name', placeholder: 'Insurance agent' },
  { key: 'agent_phone', label: 'Agent Phone', placeholder: '(555) 123-4567' },
  { key: 'agent_email', label: 'Agent Email', placeholder: 'agent@insurance.com' },
  { key: 'document_url', label: 'Document URL', placeholder: 'https://...' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Insurance() {
  return (
    <GenericFeature
      title="Insurance Certificates"
      icon="🛡️"
      apiEndpoint="/insurance"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Insurance;
