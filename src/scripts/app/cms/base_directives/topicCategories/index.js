'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.cms.baseDirectives.TopicCategories', [
  'underscore',
  require('./../../../../services/lms/topicCategory.js').name,
])
.controller('TopicCategoriesDirectiveController', require('./topicCategories.ctrl.js'))
.directive('topicCategorySelector', function () {
  return {
    restrict: 'E',
    templateUrl: 'baseTopicCategories.html',
    controller: 'TopicCategoriesDirectiveController',
    scope: {
      model: '='
    }
  };
});
