import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'name', label: 'Crew Name' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'status', label: 'Status' },
  { key: 'max_members', label: 'Max Members' },
  { key: 'color_code', label: 'Color' },
];

const formFields = [
  { key: 'name', label: 'Crew Name', placeholder: 'Alpha Crew' },
  { key: 'lead_user_id', label: 'Lead User ID', type: 'number' },
  { key: 'location_id', label: 'Location ID', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'on_leave'] },
  { key: 'specialty', label: 'Specialty', type: 'select', options: ['Residential', 'Commercial', 'Roof', 'Concrete', 'Fleet', 'General'] },
  { key: 'max_members', label: 'Max Members', type: 'number', placeholder: '4' },
  { key: 'color_code', label: 'Color Code', placeholder: '#FF5722' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Crews() {
  return (
    <GenericFeature
      title="Crew Management"
      icon="👷"
      apiEndpoint="/crews"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Crews;
