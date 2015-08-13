'use strict';

module.exports = [
  {
    type: 'select',
    autoOptions: 'concept.title for concept in concepts.concept_level_2 track by concept.uid',
    model: 'concept_level_2'
  },
  {
    type: 'select',
    autoOptions: 'concept.title for concept in concepts.concept_level_1 track by concept.uid',
    model: 'concept_level_1'
  },
  {
    type: 'select',
    autoOptions: 'concept.title for concept in concepts.concept_level_0 track by concept.uid',
    model: 'concept_level_0'
  },
  {
    type: 'number',
    label: 'Number of Questions',
    model: 'number_of_questions'
  }
];
