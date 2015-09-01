'use strict';

module.exports = {
  type: 'select',
  label: 'Standard Level',
  autoOptions: 'standard_level.name for standard_level in standard_levels track by standard_level.uid',
  model: 'standard_level',
  required: true
};
