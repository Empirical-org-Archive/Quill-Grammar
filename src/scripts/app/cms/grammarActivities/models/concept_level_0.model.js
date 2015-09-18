'use strict';

module.exports = {
  type: 'select',
  autoOptions: 'concept.title for concept in concepts.concept_level_0 track by concept.concept_level_0.uid',
  model: 'concept_level_0',
  label: 'Concept Level 0',
  required: true
};
