'use strict';

module.exports = [
  {
    type: 'select',
    options: [
      {label: 'concept level 2 - ex1'},
      {label: 'concept level 2 - ex2'},
      {label: 'concept level 2 - ex3'},
    ],
    model: 'concept_level_2'
  },
  {
    type: 'select',
    options: [
      {label: 'concept level 1 - ex1'},
      {label: 'concept level 1 - ex2'},
      {label: 'concept level 1 - ex3'},
    ],
    model: 'concept_level_1'
  },
  {
    type: 'select',
    options: [
      {label: 'concept level 0 - ex1'},
      {label: 'concept level 0 - ex2'},
      {label: 'concept level 0 - ex3'},
    ],
    model: 'concept_level_0'
  },
  {
    type: 'number',
    label: 'Number of Questions',
    model: 'number_of_questions'
  }
];
