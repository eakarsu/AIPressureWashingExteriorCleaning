import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'name', label: 'Chemical Name' },
  { key: 'chemical_type', label: 'Type' },
  { key: 'concentration_percent', label: 'Concentration %' },
  { key: 'current_stock', label: 'Stock' },
  { key: 'cost_per_unit', label: 'Cost/Unit', type: 'currency' },
  { key: 'downstream_ratio', label: 'DS Ratio' },
];

const formFields = [
  { key: 'name', label: 'Chemical Name', placeholder: 'Sodium Hypochlorite 12.5%' },
  { key: 'brand', label: 'Brand', placeholder: 'Various' },
  { key: 'chemical_type', label: 'Chemical Type', type: 'select', options: ['Oxidizer', 'Surfactant', 'Degreaser', 'Acid', 'Brightener', 'Neutralizer', 'Specialty'] },
  { key: 'active_ingredient', label: 'Active Ingredient', placeholder: 'Sodium Hypochlorite' },
  { key: 'concentration_percent', label: 'Concentration %', type: 'number', placeholder: '12.5' },
  { key: 'unit_of_measure', label: 'Unit of Measure', type: 'select', options: ['gallons', 'liters', 'pounds', 'ounces', 'each'] },
  { key: 'current_stock', label: 'Current Stock', type: 'number', placeholder: '0' },
  { key: 'reorder_level', label: 'Reorder Level', type: 'number', placeholder: '5' },
  { key: 'cost_per_unit', label: 'Cost Per Unit', type: 'number', placeholder: '0.00' },
  { key: 'supplier', label: 'Supplier', placeholder: 'Supplier name' },
  { key: 'mixing_ratio_chemical', label: 'Mix Ratio (Chemical)', placeholder: '1' },
  { key: 'mixing_ratio_water', label: 'Mix Ratio (Water)', placeholder: '3' },
  { key: 'downstream_ratio', label: 'Downstream Ratio', placeholder: '10:1' },
  { key: 'xjet_ratio', label: 'X-Jet Ratio', placeholder: '6:1' },
  { key: 'recommended_surfaces', label: 'Recommended Surfaces', type: 'textarea' },
  { key: 'safety_notes', label: 'Safety Notes', type: 'textarea' },
];

function Chemicals() {
  return (
    <GenericFeature
      title="Chemical Inventory"
      icon="🧪"
      apiEndpoint="/chemicals"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Chemicals;
