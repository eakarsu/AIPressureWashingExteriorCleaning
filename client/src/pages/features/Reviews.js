import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'customer_id', label: 'Customer ID' },
  { key: 'rating', label: 'Rating' },
  { key: 'title', label: 'Title' },
  { key: 'platform', label: 'Platform' },
  { key: 'is_public', label: 'Public' },
];

const formFields = [
  { key: 'customer_id', label: 'Customer ID', type: 'number' },
  { key: 'job_id', label: 'Job ID', type: 'number' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number', placeholder: '5' },
  { key: 'title', label: 'Review Title', placeholder: 'Great service!' },
  { key: 'comment', label: 'Comment', type: 'textarea' },
  { key: 'service_quality', label: 'Service Quality (1-5)', type: 'number' },
  { key: 'professionalism', label: 'Professionalism (1-5)', type: 'number' },
  { key: 'punctuality', label: 'Punctuality (1-5)', type: 'number' },
  { key: 'value_for_money', label: 'Value for Money (1-5)', type: 'number' },
  { key: 'would_recommend', label: 'Would Recommend', type: 'select', options: ['true', 'false'] },
  { key: 'is_public', label: 'Public', type: 'select', options: ['true', 'false'] },
  { key: 'platform', label: 'Platform', type: 'select', options: ['internal', 'google', 'yelp', 'facebook', 'bbb', 'angi', 'nextdoor'] },
  { key: 'response', label: 'Response', type: 'textarea' },
];

function Reviews() {
  return (
    <GenericFeature
      title="Reviews"
      icon="⭐"
      apiEndpoint="/reviews"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Reviews;
