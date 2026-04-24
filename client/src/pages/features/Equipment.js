import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'name', label: 'Equipment Name' },
  { key: 'category', label: 'Category' },
  { key: 'brand', label: 'Brand' },
  { key: 'psi_rating', label: 'PSI' },
  { key: 'status', label: 'Status' },
  { key: 'condition_rating', label: 'Condition' },
];

const formFields = [
  { key: 'name', label: 'Equipment Name', placeholder: 'Hot Water Skid 4000PSI' },
  { key: 'category', label: 'Category', type: 'select', options: ['Pressure Washer', 'Surface Cleaner', 'Nozzle', 'Hose', 'Pump', 'Engine', 'Trailer', 'Soft Wash System', 'Accessory', 'Safety'] },
  { key: 'brand', label: 'Brand', placeholder: 'Hydro Tek' },
  { key: 'model', label: 'Model', placeholder: 'SC30008H' },
  { key: 'serial_number', label: 'Serial Number', placeholder: 'SN-12345' },
  { key: 'equipment_type', label: 'Equipment Type', placeholder: 'Hot Water Skid' },
  { key: 'psi_rating', label: 'PSI Rating', type: 'number', placeholder: '4000' },
  { key: 'gpm_rating', label: 'GPM Rating', type: 'number', placeholder: '4.0' },
  { key: 'fuel_type', label: 'Fuel Type', type: 'select', options: ['Gasoline', 'Diesel', 'Electric', 'Propane', 'N/A'] },
  { key: 'purchase_date', label: 'Purchase Date', type: 'date' },
  { key: 'purchase_price', label: 'Purchase Price', type: 'number', placeholder: '0.00' },
  { key: 'current_value', label: 'Current Value', type: 'number', placeholder: '0.00' },
  { key: 'status', label: 'Status', type: 'select', options: ['available', 'in_use', 'maintenance', 'retired', 'lost'] },
  { key: 'condition_rating', label: 'Condition (1-10)', type: 'number', placeholder: '8' },
  { key: 'hours_used', label: 'Hours Used', type: 'number' },
  { key: 'next_service_date', label: 'Next Service Date', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Equipment() {
  return (
    <GenericFeature
      title="Equipment Inventory"
      icon="🔧"
      apiEndpoint="/equipment"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Equipment;
