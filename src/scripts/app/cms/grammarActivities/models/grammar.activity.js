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
  {
    type: 'select',
    label: 'Topic Category',
    autoOptions: 'topicCategory.name for topicCategory in topicCategories track by topicCategory.uid',
    model: 'topicCategory'
  }
];
