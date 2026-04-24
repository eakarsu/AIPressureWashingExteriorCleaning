import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'user_id', label: 'User ID' },
  { key: 'entry_date', label: 'Date', type: 'date' },
  { key: 'clock_in', label: 'Clock In' },
  { key: 'clock_out', label: 'Clock Out' },
  { key: 'total_hours', label: 'Hours' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'user_id', label: 'User ID', type: 'number' },
  { key: 'job_id', label: 'Job ID', type: 'number' },
  { key: 'crew_id', label: 'Crew ID', type: 'number' },
  { key: 'entry_date', label: 'Date', type: 'date' },
  { key: 'clock_in', label: 'Clock In', placeholder: '2024-01-15T08:00:00' },
  { key: 'clock_out', label: 'Clock Out', placeholder: '2024-01-15T16:00:00' },
  { key: 'break_minutes', label: 'Break (minutes)', type: 'number', placeholder: '30' },
  { key: 'total_hours', label: 'Total Hours', type: 'number' },
  { key: 'entry_type', label: 'Type', type: 'select', options: ['work', 'overtime', 'holiday', 'pto', 'sick'] },
  { key: 'hourly_rate', label: 'Hourly Rate', type: 'number', placeholder: '0.00' },
  { key: 'total_pay', label: 'Total Pay', type: 'number', placeholder: '0.00' },
  { key: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function TimeTracking() {
  return (
    <GenericFeature
      title="Time Tracking"
      icon="⏱️"
      apiEndpoint="/time-tracking"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default TimeTracking;
