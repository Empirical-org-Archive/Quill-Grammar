'use strict';

module.exports = [
  {
    type: 'text',
    label: 'Prompt',
    model: 'prompt',
    required: true
  },
  {
    type: 'text',
    label: 'Instructions',
    model: 'instructions',
    required: true
  },
  {
    type: 'submit',
    label: 'Submit Concept Question',
    model: 'submit'
  }
];
