'use strict';

module.exports = [
  {
    type: 'text',
    label: 'Title',
    model: 'title'
  },
  {
    type: 'textarea',
    label: 'Description',
    model: 'description'
  },
  {
    type: 'select',
    label: 'Standard Level',
    options: [
      {label: 'Standard Level 1'},
      {label: 'Standard Level 2'}
    ],
    model: 'standard'
  },
  {
    type: 'select',
    label: 'Standard',
    options: [
      {label: 'Standard 1'},
      {label: 'Standard 2'}
    ],
    model: 'standard_level'
  },
  {
    type: 'select',
    label: 'Theme',
    options: [
      {label: 'Theme 1'},
      {label: 'Theme 2'}
    ],
    model: 'theme'
  },
  {
    type: 'submit',
    label: 'Submit Activity',
    model: 'submit'
  }
];
