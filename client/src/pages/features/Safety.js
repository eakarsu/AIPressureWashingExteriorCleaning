import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'checklist_date', label: 'Date', type: 'date' },
  { key: 'job_id', label: 'Job ID' },
  { key: 'crew_id', label: 'Crew ID' },
  { key: 'equipment_inspected', label: 'Equip Inspected' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'job_id', label: 'Job ID', type: 'number' },
  { key: 'crew_id', label: 'Crew ID', type: 'number' },
  { key: 'completed_by', label: 'Completed By (User ID)', type: 'number' },
  { key: 'checklist_date', label: 'Date', type: 'date' },
  { key: 'ppe_hard_hat', label: 'PPE: Hard Hat', type: 'select', options: ['true', 'false'] },
  { key: 'ppe_safety_glasses', label: 'PPE: Safety Glasses', type: 'select', options: ['true', 'false'] },
  { key: 'ppe_gloves', label: 'PPE: Gloves', type: 'select', options: ['true', 'false'] },
  { key: 'ppe_boots', label: 'PPE: Boots', type: 'select', options: ['true', 'false'] },
  { key: 'equipment_inspected', label: 'Equipment Inspected', type: 'select', options: ['true', 'false'] },
  { key: 'hoses_inspected', label: 'Hoses Inspected', type: 'select', options: ['true', 'false'] },
  { key: 'chemical_labels_checked', label: 'Chemical Labels Checked', type: 'select', options: ['true', 'false'] },
  { key: 'area_secured', label: 'Area Secured', type: 'select', options: ['true', 'false'] },
  { key: 'weather_appropriate', label: 'Weather Appropriate', type: 'select', options: ['true', 'false'] },
  { key: 'status', label: 'Status', type: 'select', options: ['completed', 'incomplete', 'needs_review'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Safety() {
  return (
    <GenericFeature
      title="Safety Checklists"
      icon="✅"
      apiEndpoint="/safety"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Safety;
