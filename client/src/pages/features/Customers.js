import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'customer_type', label: 'Type' },
  { key: 'is_active', label: 'Active' },
];

const formFields = [
  { key: 'first_name', label: 'First Name', placeholder: 'John' },
  { key: 'last_name', label: 'Last Name', placeholder: 'Smith' },
  { key: 'email', label: 'Email', placeholder: 'john@example.com' },
  { key: 'phone', label: 'Phone', placeholder: '(555) 123-4567' },
  { key: 'alt_phone', label: 'Alt Phone', placeholder: '(555) 987-6543' },
  { key: 'customer_type', label: 'Customer Type', type: 'select', options: ['residential', 'commercial', 'industrial', 'hoa'] },
  { key: 'company_name', label: 'Company Name', placeholder: 'Optional for commercial' },
  { key: 'billing_address_line1', label: 'Billing Address', placeholder: '123 Main St' },
  { key: 'billing_city', label: 'City', placeholder: 'Houston' },
  { key: 'billing_state', label: 'State', placeholder: 'TX' },
  { key: 'billing_zip', label: 'Zip', placeholder: '77001' },
  { key: 'referral_source', label: 'Referral Source', type: 'select', options: ['Google', 'Facebook', 'Referral', 'NextDoor', 'Yelp', 'Drive By', 'Website', 'Other'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Customers() {
  return (
    <GenericFeature
      title="Customers"
      icon="👥"
      apiEndpoint="/customers"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Customers;
