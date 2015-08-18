'use strict';

module.exports =
angular.module('quill-grammar.cms.grammarActivities.directives', [
  'dynform',
  require('../../../../services/lms/theme.js').name,
  require('../../../../services/lms/concept.js').name,
  require('../../../../services/lms/standard.js').name,
])
.controller('GrammarActivityFormCtrl', require('./grammarActivityForm.controller.js'))
.directive('grammarActivityForm', require('./grammarActivityForm.directive.js'))
;
