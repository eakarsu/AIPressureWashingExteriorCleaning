import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'title', label: 'Training' },
  { key: 'training_type', label: 'Type' },
  { key: 'user_id', label: 'User ID' },
  { key: 'completed_date', label: 'Completed', type: 'date' },
  { key: 'expiry_date', label: 'Expires', type: 'date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'user_id', label: 'User ID', type: 'number' },
  { key: 'training_type', label: 'Training Type', type: 'select', options: ['OSHA Safety', 'Chemical Handling', 'Equipment Operation', 'Roof Safety', 'First Aid/CPR', 'Ladder Safety', 'Customer Service', 'Driver Safety', 'Environmental Compliance', 'New Hire Orientation'] },
  { key: 'title', label: 'Title', placeholder: 'OSHA 10-Hour General Safety' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'provider', label: 'Provider', placeholder: 'Training provider' },
  { key: 'certification_number', label: 'Certification Number' },
  { key: 'completed_date', label: 'Completed Date', type: 'date' },
  { key: 'expiry_date', label: 'Expiry Date', type: 'date' },
  { key: 'score', label: 'Score', type: 'number', placeholder: '95' },
  { key: 'passed', label: 'Passed', type: 'select', options: ['true', 'false'] },
  { key: 'hours', label: 'Training Hours', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['completed', 'in_progress', 'expired', 'scheduled', 'failed'] },
];

function Training() {
  return (
    <GenericFeature
      title="Training Records"
      icon="📚"
      apiEndpoint="/training"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Training;
