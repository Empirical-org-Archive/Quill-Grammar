'use strict';

module.exports =
angular.module('quill-grammar.cms.concepts.directives', [
  'dynform',
  require('./../../base_directives/index.js').name,
])
.controller('ConceptFormCtrl', require('./conceptForm.controller.js'))
.directive('conceptForm', require('./conceptForm.directive.js'))
.controller('ConceptQuestionFormCtrl', require('./conceptQuestionForm.controller.js'))
.directive('conceptQuestionForm', require('./conceptQuestionForm.directive.js'))
;
