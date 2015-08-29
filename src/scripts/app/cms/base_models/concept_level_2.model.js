'use strict';

module.exports = {
  type: 'select',
  autoOptions: 'concept.title for concept in concepts.concept_level_2 track by concept.uid',
  model: 'concept_level_2',
  label: 'Concept Level 2',
  required: true
};
