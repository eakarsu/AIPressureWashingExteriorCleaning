import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'plan_name', label: 'Plan Name' },
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'price_per_visit', label: 'Price/Visit', type: 'currency' },
  { key: 'status', label: 'Status' },
  { key: 'next_service_date', label: 'Next Service', type: 'date' },
];

const formFields = [
  { key: 'plan_name', label: 'Plan Name', placeholder: 'Annual House Wash Plan' },
  { key: 'customer_id', label: 'Customer ID', type: 'number' },
  { key: 'property_id', label: 'Property ID', type: 'number' },
  { key: 'service_id', label: 'Service ID', type: 'number' },
  { key: 'frequency', label: 'Frequency', type: 'select', options: ['weekly', 'bi_weekly', 'monthly', 'quarterly', 'semi_annual', 'annual'] },
  { key: 'price_per_visit', label: 'Price Per Visit', type: 'number', placeholder: '0.00' },
  { key: 'annual_price', label: 'Annual Price', type: 'number', placeholder: '0.00' },
  { key: 'discount_percent', label: 'Discount %', type: 'number', placeholder: '0' },
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
  { key: 'next_service_date', label: 'Next Service Date', type: 'date' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'paused', 'cancelled', 'expired'] },
  { key: 'auto_renew', label: 'Auto Renew', type: 'select', options: ['true', 'false'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function ServicePlans() {
  return (
    <GenericFeature
      title="Recurring Service Plans"
      icon="🔄"
      apiEndpoint="/service-plans"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default ServicePlans;
