import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'maintenance_type', label: 'Type' },
  { key: 'equipment_id', label: 'Equipment ID' },
  { key: 'performed_date', label: 'Date', type: 'date' },
  { key: 'cost', label: 'Cost', type: 'currency' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'equipment_id', label: 'Equipment ID', type: 'number' },
  { key: 'vehicle_id', label: 'Vehicle ID', type: 'number' },
  { key: 'performed_by', label: 'Performed By (User ID)', type: 'number' },
  { key: 'maintenance_type', label: 'Maintenance Type', type: 'select', options: ['Preventive', 'Corrective', 'Oil Change', 'Filter Replacement', 'Pump Rebuild', 'Hose Replacement', 'Calibration', 'Inspection'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'parts_replaced', label: 'Parts Replaced', type: 'textarea' },
  { key: 'cost', label: 'Cost', type: 'number', placeholder: '0.00' },
  { key: 'vendor', label: 'Vendor', placeholder: 'Service provider' },
  { key: 'hours_at_service', label: 'Hours at Service', type: 'number' },
  { key: 'mileage_at_service', label: 'Mileage at Service', type: 'number' },
  { key: 'performed_date', label: 'Performed Date', type: 'date' },
  { key: 'next_service_date', label: 'Next Service Date', type: 'date' },
  { key: 'status', label: 'Status', type: 'select', options: ['completed', 'in_progress', 'scheduled', 'overdue', 'cancelled'] },
];

function Maintenance() {
  return (
    <GenericFeature
      title="Equipment Maintenance"
      icon="🔩"
      apiEndpoint="/maintenance"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Maintenance;
