import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'contract_number', label: 'Contract #' },
  { key: 'title', label: 'Title' },
  { key: 'contract_type', label: 'Type' },
  { key: 'annual_amount', label: 'Annual Value', type: 'currency' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'contract_number', label: 'Contract Number', placeholder: 'CON-2024-001' },
  { key: 'customer_id', label: 'Customer ID', type: 'number' },
  { key: 'property_id', label: 'Property ID', type: 'number' },
  { key: 'title', label: 'Title', placeholder: 'Annual Maintenance Agreement' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'contract_type', label: 'Contract Type', type: 'select', options: ['annual', 'multi_year', 'seasonal', 'on_call', 'project'] },
  { key: 'status', label: 'Status', type: 'select', options: ['draft', 'active', 'pending_renewal', 'expired', 'cancelled'] },
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'monthly_amount', label: 'Monthly Amount', type: 'number', placeholder: '0.00' },
  { key: 'annual_amount', label: 'Annual Amount', type: 'number', placeholder: '0.00' },
  { key: 'payment_terms', label: 'Payment Terms', type: 'select', options: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt'] },
  { key: 'scope_of_work', label: 'Scope of Work', type: 'textarea' },
  { key: 'frequency', label: 'Service Frequency', type: 'select', options: ['weekly', 'bi_weekly', 'monthly', 'quarterly', 'semi_annual', 'annual'] },
  { key: 'auto_renew', label: 'Auto Renew', type: 'select', options: ['true', 'false'] },
];

function Contracts() {
  return (
    <GenericFeature
      title="Commercial Contracts"
      icon="📝"
      apiEndpoint="/contracts"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Contracts;
