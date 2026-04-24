import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'quote_number', label: 'Quote #' },
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'status', label: 'Status' },
  { key: 'total_amount', label: 'Total', type: 'currency' },
  { key: 'valid_until', label: 'Valid Until', type: 'date' },
];

const formFields = [
  { key: 'quote_number', label: 'Quote Number', placeholder: 'Q-2024-001' },
  { key: 'customer_id', label: 'Customer ID', type: 'number' },
  { key: 'property_id', label: 'Property ID', type: 'number' },
  { key: 'service_id', label: 'Service ID', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['draft', 'sent', 'accepted', 'declined', 'expired'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'total_sqft', label: 'Total Sq Ft', type: 'number' },
  { key: 'unit_price', label: 'Unit Price', type: 'number', placeholder: '0.00' },
  { key: 'subtotal', label: 'Subtotal', type: 'number', placeholder: '0.00' },
  { key: 'discount_percent', label: 'Discount %', type: 'number', placeholder: '0' },
  { key: 'tax_rate', label: 'Tax Rate %', type: 'number', placeholder: '8.25' },
  { key: 'total_amount', label: 'Total Amount', type: 'number', placeholder: '0.00' },
  { key: 'valid_until', label: 'Valid Until', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Quotes() {
  return (
    <GenericFeature
      title="Quotes & Estimation"
      icon="📋"
      apiEndpoint="/quotes"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Quotes;
