'use strict';

module.exports =
angular.module('quill-grammar.cms.grammarActivities.directives', [
  'dynform'
])
.controller('GrammarActivityFormCtrl', require('./grammarActivityForm.controller.js'))
.directive('grammarActivityForm', require('./grammarActivityForm.directive.js'))
;
