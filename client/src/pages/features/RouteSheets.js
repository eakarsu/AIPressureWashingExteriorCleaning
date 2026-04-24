import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'route_date', label: 'Date', type: 'date' },
  { key: 'crew_id', label: 'Crew ID' },
  { key: 'total_jobs', label: 'Total Jobs' },
  { key: 'total_estimated_hours', label: 'Est. Hours' },
  { key: 'total_miles', label: 'Miles' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'route_date', label: 'Route Date', type: 'date' },
  { key: 'crew_id', label: 'Crew ID', type: 'number' },
  { key: 'vehicle_id', label: 'Vehicle ID', type: 'number' },
  { key: 'location_id', label: 'Location ID', type: 'number' },
  { key: 'total_jobs', label: 'Total Jobs', type: 'number' },
  { key: 'total_estimated_hours', label: 'Est. Hours', type: 'number' },
  { key: 'total_actual_hours', label: 'Actual Hours', type: 'number' },
  { key: 'total_miles', label: 'Total Miles', type: 'number' },
  { key: 'start_mileage', label: 'Start Mileage', type: 'number' },
  { key: 'end_mileage', label: 'End Mileage', type: 'number' },
  { key: 'fuel_gallons', label: 'Fuel (Gallons)', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['planned', 'in_progress', 'completed', 'modified', 'cancelled'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function RouteSheets() {
  return (
    <GenericFeature
      title="Route Sheets"
      icon="🗺️"
      apiEndpoint="/route-sheets"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default RouteSheets;
