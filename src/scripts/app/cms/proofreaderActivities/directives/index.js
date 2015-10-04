'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.cms.proofreaderActivities.directives', [
  require('../../../../services/lms/topicCategory.js').name,
  require('../../base_directives/concepts/index.js').name,
  require('../../base_directives/standards/index.js').name,
  require('../../base_directives/topicCategories/index.js').name,
])
.controller('ProofreaderActivityFormCtrl', require('./proofreaderActivityForm.controller.js'))
.directive('proofreaderActivityForm', require('./proofreaderActivityForm.directive.js'))

;
