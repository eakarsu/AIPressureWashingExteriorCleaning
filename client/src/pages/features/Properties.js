import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'property_name', label: 'Property Name' },
  { key: 'address_line1', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'property_type', label: 'Type' },
  { key: 'square_footage', label: 'Sq Ft' },
  { key: 'stories', label: 'Stories' },
];

const formFields = [
  { key: 'customer_id', label: 'Customer ID', type: 'number' },
  { key: 'property_name', label: 'Property Name', placeholder: 'Main Residence' },
  { key: 'address_line1', label: 'Address', placeholder: '123 Oak Lane' },
  { key: 'address_line2', label: 'Address Line 2', placeholder: 'Apt/Suite' },
  { key: 'city', label: 'City', placeholder: 'Houston' },
  { key: 'state', label: 'State', placeholder: 'TX' },
  { key: 'zip_code', label: 'Zip Code', placeholder: '77001' },
  { key: 'property_type', label: 'Property Type', type: 'select', options: ['residential', 'commercial', 'industrial', 'hoa', 'multi_family'] },
  { key: 'square_footage', label: 'Square Footage', type: 'number', placeholder: '2500' },
  { key: 'stories', label: 'Stories', type: 'number', placeholder: '2' },
  { key: 'roof_type', label: 'Roof Type', type: 'select', options: ['Asphalt Shingle', 'Metal', 'Tile', 'Slate', 'Wood Shake', 'Flat/TPO'] },
  { key: 'siding_type', label: 'Siding Type', type: 'select', options: ['Vinyl', 'Brick', 'Stucco', 'Wood', 'Stone', 'Hardie Board', 'Aluminum'] },
  { key: 'deck_material', label: 'Deck Material', type: 'select', options: ['Wood', 'Composite', 'Trex', 'PVC', 'None'] },
  { key: 'driveway_sqft', label: 'Driveway Sq Ft', type: 'number' },
  { key: 'has_pool', label: 'Has Pool', type: 'select', options: ['true', 'false'] },
  { key: 'has_fence', label: 'Has Fence', type: 'select', options: ['true', 'false'] },
  { key: 'gate_code', label: 'Gate Code', placeholder: '#1234' },
  { key: 'special_instructions', label: 'Special Instructions', type: 'textarea' },
];

function Properties() {
  return (
    <GenericFeature
      title="Properties"
      icon="🏠"
      apiEndpoint="/properties"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Properties;
