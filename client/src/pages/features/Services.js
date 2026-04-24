import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'name', label: 'Service Name' },
  { key: 'category', label: 'Category' },
  { key: 'base_price', label: 'Base Price', type: 'currency' },
  { key: 'price_unit', label: 'Unit' },
  { key: 'estimated_duration_minutes', label: 'Duration (min)' },
  { key: 'is_active', label: 'Active' },
];

const formFields = [
  { key: 'name', label: 'Service Name', placeholder: 'e.g. House Wash' },
  { key: 'slug', label: 'Slug', placeholder: 'e.g. house-wash' },
  { key: 'category', label: 'Category', type: 'select', options: ['Residential', 'Commercial', 'Industrial', 'Specialty'] },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'base_price', label: 'Base Price', type: 'number', placeholder: '0.00' },
  { key: 'price_unit', label: 'Price Unit', type: 'select', options: ['per_sqft', 'per_linear_ft', 'flat_rate', 'per_hour'] },
  { key: 'min_price', label: 'Minimum Price', type: 'number', placeholder: '0.00' },
  { key: 'estimated_duration_minutes', label: 'Est. Duration (minutes)', type: 'number', placeholder: '60' },
  { key: 'requires_soft_wash', label: 'Requires Soft Wash', type: 'select', options: ['true', 'false'] },
  { key: 'requires_hot_water', label: 'Requires Hot Water', type: 'select', options: ['true', 'false'] },
  { key: 'chemical_required', label: 'Chemical Required', type: 'select', options: ['true', 'false'] },
  { key: 'is_active', label: 'Active', type: 'select', options: ['true', 'false'] },
];

function Services() {
  return (
    <GenericFeature
      title="Service Catalog"
      icon="🧹"
      apiEndpoint="/services"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Services;
