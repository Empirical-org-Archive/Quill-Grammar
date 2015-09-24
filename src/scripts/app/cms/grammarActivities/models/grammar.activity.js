'use strict';

module.exports = [
  {
    type: 'text',
    label: 'Title',
    model: 'title',
    required: true
  },
  {
    type: 'textarea',
    label: 'Description',
    model: 'description',
    required: true
  },
  require('./../../base_models/standard.model.js'),
  require('./../../base_models/standards_level.model.js'),
  {
    type: 'select',
    label: 'Topic Category',
    autoOptions: 'topicCategory.name for topicCategory in topicCategories track by topicCategory.uid',
    model: 'topicCategory'
  },
  {
    type: 'submit',
    label: 'Submit Activity',
    model: 'submit'
  }
];
