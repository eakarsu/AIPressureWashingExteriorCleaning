import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'id', label: 'Report ID' },
  { key: 'name', label: 'Report Name' },
  { key: 'description', label: 'Description' },
];

const formFields = [
  { key: 'name', label: 'Report Name' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'start_date', label: 'Start Date', type: 'date' },
  { key: 'end_date', label: 'End Date', type: 'date' },
];

function Reports() {
  return (
    <GenericFeature
      title="Financial Reports"
      icon="📊"
      apiEndpoint="/reports"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Reports;
