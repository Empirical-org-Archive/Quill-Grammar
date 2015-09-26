'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.cms.grammarActivities.directives', [
  'dynform',
  require('../../../../services/lms/topicCategory.js').name,
  require('../../base_directives/concepts/index.js').name,
  require('../../base_directives/standards/index.js').name,
  require('../../base_directives/topicCategories/index.js').name,
])
.controller('GrammarActivityFormCtrl', require('./grammarActivityForm.controller.js'))
.directive('grammarActivityForm', require('./grammarActivityForm.directive.js'))

;
