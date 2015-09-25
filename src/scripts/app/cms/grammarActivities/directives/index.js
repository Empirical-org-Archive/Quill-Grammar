'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.cms.grammarActivities.directives', [
  'dynform',
  require('../../../../services/lms/topicCategory.js').name,
  require('../../../../services/lms/concept.js').name,
  require('../../../../services/lms/standard.js').name,
  require('../../../../services/lms/standard_level.js').name,
  require('../../base_directives/concepts/index.js').name,
  require('../../base_directives/standards/index.js').name,
])
.controller('GrammarActivityFormCtrl', require('./grammarActivityForm.controller.js'))
.directive('grammarActivityForm', require('./grammarActivityForm.directive.js'))

;
