'use strict';

module.exports = {
  type: 'select',
  label: 'Standard',
  autoOptions: 'standard.name for standard in standards track by standard.uid',
  model: 'standard',
  required: true
};
