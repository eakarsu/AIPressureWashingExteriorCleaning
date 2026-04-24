import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'booking_number', label: 'Booking #' },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'preferred_date', label: 'Requested Date', type: 'date' },
  { key: 'source', label: 'Source' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'booking_number', label: 'Booking Number', placeholder: 'BK-2024-001' },
  { key: 'first_name', label: 'First Name', placeholder: 'John' },
  { key: 'last_name', label: 'Last Name', placeholder: 'Smith' },
  { key: 'email', label: 'Email', placeholder: 'john@example.com' },
  { key: 'phone', label: 'Phone', placeholder: '(555) 123-4567' },
  { key: 'service_id', label: 'Service ID', type: 'number' },
  { key: 'address_line1', label: 'Address', placeholder: '123 Main St' },
  { key: 'city', label: 'City', placeholder: 'Houston' },
  { key: 'state', label: 'State', placeholder: 'TX' },
  { key: 'zip_code', label: 'Zip Code', placeholder: '77001' },
  { key: 'preferred_date', label: 'Preferred Date', type: 'date' },
  { key: 'preferred_time', label: 'Preferred Time', type: 'select', options: ['Morning (8-12)', 'Afternoon (12-4)', 'Evening (4-7)', 'Flexible'] },
  { key: 'property_sqft', label: 'Property Sq Ft', type: 'number' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'source', label: 'Source', type: 'select', options: ['website', 'google', 'yelp', 'facebook', 'phone', 'referral'] },
  { key: 'status', label: 'Status', type: 'select', options: ['pending', 'confirmed', 'scheduled', 'completed', 'cancelled'] },
];

function Bookings() {
  return (
    <GenericFeature
      title="Online Bookings"
      icon="🌐"
      apiEndpoint="/bookings"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Bookings;
