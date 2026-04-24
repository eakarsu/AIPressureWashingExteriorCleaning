import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'referrer_name', label: 'Referrer' },
  { key: 'referred_name', label: 'Referred' },
  { key: 'referral_code', label: 'Code' },
  { key: 'reward_amount', label: 'Reward', type: 'currency' },
  { key: 'status', label: 'Status' },
];

const formFields = [
  { key: 'referrer_customer_id', label: 'Referrer Customer ID', type: 'number' },
  { key: 'referrer_name', label: 'Referrer Name', placeholder: 'Who referred' },
  { key: 'referred_name', label: 'Referred Name', placeholder: 'New customer name' },
  { key: 'referred_email', label: 'Referred Email', placeholder: 'new@example.com' },
  { key: 'referred_phone', label: 'Referred Phone', placeholder: '(555) 123-4567' },
  { key: 'referral_code', label: 'Referral Code', placeholder: 'REF-XXXX' },
  { key: 'status', label: 'Status', type: 'select', options: ['pending', 'contacted', 'converted', 'reward_sent', 'expired', 'declined'] },
  { key: 'reward_type', label: 'Reward Type', type: 'select', options: ['discount', 'cash', 'free_service', 'gift_card', 'credit'] },
  { key: 'reward_amount', label: 'Reward Amount', type: 'number', placeholder: '0.00' },
  { key: 'reward_issued', label: 'Reward Issued', type: 'select', options: ['true', 'false'] },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

function Referrals() {
  return (
    <GenericFeature
      title="Referral Tracking"
      icon="🤝"
      apiEndpoint="/referrals"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Referrals;
