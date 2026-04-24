import React from 'react';
import GenericFeature from '../GenericFeature';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'job_id', label: 'Job ID' },
  { key: 'photo_type', label: 'Type' },
  { key: 'surface_type', label: 'Surface' },
  { key: 'caption', label: 'Caption' },
];

const formFields = [
  { key: 'job_id', label: 'Job ID', type: 'number' },
  { key: 'property_id', label: 'Property ID', type: 'number' },
  { key: 'photo_type', label: 'Photo Type', type: 'select', options: ['before', 'after', 'progress', 'damage', 'issue'] },
  { key: 'url', label: 'Photo URL', placeholder: 'https://...' },
  { key: 'caption', label: 'Caption', type: 'textarea', placeholder: 'Describe the photo' },
  { key: 'surface_type', label: 'Surface Type', type: 'select', options: ['Vinyl Siding', 'Brick', 'Concrete', 'Wood Deck', 'Roof', 'Driveway', 'Fence', 'Gutter'] },
  { key: 'tags', label: 'Tags', placeholder: 'before-after, transformation' },
];

function Photos() {
  return (
    <GenericFeature
      title="Photo Documentation"
      icon="📷"
      apiEndpoint="/photos"
      columns={columns}
      formFields={formFields}
    />
  );
}

export default Photos;
