import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'compliance_type', label: 'Type' },
  { key: 'jurisdiction', label: 'Jurisdiction' },
  { key: 'permit_number', label: 'Permit #' },
  { key: 'expiry_date', label: 'Expires', type: 'date' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'compliance_type', label: 'Compliance Type', type: 'select', options: ['Water Discharge', 'Chemical Storage', 'Waste Disposal', 'Stormwater Permit', 'EPA Reporting', 'State Environmental'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'jurisdiction', label: 'Jurisdiction', placeholder: 'City/County/State' },
  { key: 'permit_number', label: 'Permit Number', placeholder: 'PERM-12345' },
  { key: 'issuing_authority', label: 'Issuing Authority', placeholder: 'EPA / State DEQ' },
  { key: 'status', label: 'Status', type: 'select', options: ['compliant', 'non_compliant', 'under_review', 'pending', 'exempt'] },
  { key: 'effective_date', label: 'Effective Date', type: 'date' },
  { key: 'expiry_date', label: 'Expiry Date', type: 'date' },
  { key: 'wastewater_method', label: 'Wastewater Method', placeholder: 'Reclaim/Filter/Discharge' },
  { key: 'reclaim_system', label: 'Has Reclaim System', type: 'select', options: ['true', 'false'] },
  { key: 'berm_required', label: 'Berm Required', type: 'select', options: ['true', 'false'] },
  { key: 'chemical_disposal_method', label: 'Chemical Disposal Method', type: 'textarea' },
  { key: 'last_audit_date', label: 'Last Audit Date', type: 'date' },
  { key: 'next_audit_date', label: 'Next Audit Date', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Environmental() {
  return (
    <GenericFeature
      title="Environmental Compliance"
      icon="🌿"
      apiEndpoint="/environmental"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Environmental;
