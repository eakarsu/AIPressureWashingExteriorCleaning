import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'vehicle_type', label: 'Type' },
  { key: 'make', label: 'Make' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Year' },
  { key: 'license_plate', label: 'Plate #' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: ['Truck', 'Trailer', 'Van', 'SUV', 'Box Truck'] },
  { key: 'make', label: 'Make', placeholder: 'Ford' },
  { key: 'model', label: 'Model', placeholder: 'F-350' },
  { key: 'year', label: 'Year', type: 'number', placeholder: '2024' },
  { key: 'vin', label: 'VIN', placeholder: 'VIN number' },
  { key: 'license_plate', label: 'License Plate', placeholder: 'ABC-1234' },
  { key: 'color', label: 'Color', placeholder: 'White' },
  { key: 'mileage', label: 'Mileage', type: 'number' },
  { key: 'fuel_type', label: 'Fuel Type', type: 'select', options: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'] },
  { key: 'assigned_crew_id', label: 'Assigned Crew ID', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'in_shop', 'out_of_service', 'reserved'] },
  { key: 'insurance_policy', label: 'Insurance Policy #' },
  { key: 'insurance_expiry', label: 'Insurance Expiry', type: 'date' },
  { key: 'registration_expiry', label: 'Registration Expiry', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Fleet() {
  return (
    <GenericFeature
      title="Fleet Tracking"
      icon="🚛"
      apiEndpoint="/fleet"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Fleet;
