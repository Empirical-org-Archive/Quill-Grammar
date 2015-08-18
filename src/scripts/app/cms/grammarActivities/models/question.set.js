'use strict';

module.exports = [
  require('./../../base_models/concept_level_2.model.js'),
  require('./../../base_models/concept_level_1.model.js'),
  require('./../../base_models/concept_level_0.model.js'),
  {
    type: 'number',
    label: 'Number of Questions',
    model: 'number_of_questions'
  }
];
