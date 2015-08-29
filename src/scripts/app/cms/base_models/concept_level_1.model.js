'use strict';

module.exports = {
  type: 'select',
  autoOptions: 'concept.title for concept in concepts.concept_level_1 track by concept.uid',
  model: 'concept_level_1',
  label: 'Concept Level 1',
  required: true
};
