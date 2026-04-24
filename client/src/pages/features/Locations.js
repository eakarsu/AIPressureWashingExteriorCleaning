import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'name', label: 'Location Name' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'service_radius_miles', label: 'Radius (mi)' },
  { key: 'is_headquarters', label: 'HQ' },
  { key: 'is_active', label: 'Active' },
];

const formFields = [
  { key: 'name', label: 'Location Name', placeholder: 'Downtown Office' },
  { key: 'address_line1', label: 'Address', placeholder: '123 Main St' },
  { key: 'address_line2', label: 'Address Line 2' },
  { key: 'city', label: 'City', placeholder: 'Houston' },
  { key: 'state', label: 'State', placeholder: 'TX' },
  { key: 'zip_code', label: 'Zip Code', placeholder: '77001' },
  { key: 'phone', label: 'Phone', placeholder: '(555) 123-4567' },
  { key: 'email', label: 'Email', placeholder: 'office@pressurewash.com' },
  { key: 'manager_id', label: 'Manager User ID', type: 'number' },
  { key: 'service_radius_miles', label: 'Service Radius (miles)', type: 'number', placeholder: '30' },
  { key: 'is_headquarters', label: 'Is Headquarters', type: 'select', options: ['true', 'false'] },
  { key: 'is_active', label: 'Active', type: 'select', options: ['true', 'false'] },
];

function Locations() {
  return (
    <GenericFeature
      title="Locations"
      icon="📍"
      apiEndpoint="/locations"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Locations;
