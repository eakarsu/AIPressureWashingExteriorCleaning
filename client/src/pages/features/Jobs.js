import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'job_number', label: 'Job #' },
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'scheduled_date', label: 'Date', type: 'date' },
  { key: 'amount', label: 'Amount', type: 'currency' },
];

const formFields = [
  { key: 'job_number', label: 'Job Number', placeholder: 'J-2024-001' },
  { key: 'customer_id', label: 'Customer ID', type: 'number' },
  { key: 'property_id', label: 'Property ID', type: 'number' },
  { key: 'service_id', label: 'Service ID', type: 'number' },
  { key: 'crew_id', label: 'Crew ID', type: 'number' },
  { key: 'quote_id', label: 'Quote ID', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'] },
  { key: 'priority', label: 'Priority', type: 'select', options: ['low', 'normal', 'high', 'urgent'] },
  { key: 'scheduled_date', label: 'Scheduled Date', type: 'date' },
  { key: 'scheduled_time_start', label: 'Start Time', placeholder: '08:00' },
  { key: 'scheduled_time_end', label: 'End Time', placeholder: '12:00' },
  { key: 'estimated_duration_minutes', label: 'Est. Duration (min)', type: 'number' },
  { key: 'total_sqft', label: 'Total Sq Ft', type: 'number' },
  { key: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Jobs() {
  return (
    <GenericFeature
      title="Job Scheduling"
      icon="📅"
      apiEndpoint="/jobs"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Jobs;
