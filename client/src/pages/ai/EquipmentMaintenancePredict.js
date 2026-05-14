import React from 'react';
import AIFeature from '../AIFeature';

const inputFields = [
  {
    key: 'equipment_id',
    label: 'Equipment ID (optional, single unit)',
    type: 'text',
    placeholder: 'Leave blank to scan whole fleet',
  },
  {
    key: 'usage_hours',
    label: 'Recent Usage Hours (optional)',
    type: 'number',
    placeholder: 'e.g., 120 hours past 30 days',
  },
  {
    key: 'notes',
    label: 'Field Notes',
    type: 'textarea',
    placeholder: 'Recent issues, unusual sounds, missed services...',
  },
];

function EquipmentMaintenancePredict() {
  return (
    <AIFeature
      title="Equipment Maintenance Predictor"
      icon="🛠️"
      apiEndpoint="/ai/equipment-maintenance-predict"
      inputFields={inputFields}
    />
  );
}

export default EquipmentMaintenancePredict;
