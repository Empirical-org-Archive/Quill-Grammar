'use strict';

module.exports =
angular.module('quill-grammar.cms.concepts.directives', [
  'dynform',
])
.controller('ConceptFormCtrl', require('./conceptForm.controller.js'))
.directive('conceptForm', require('./conceptForm.directive.js'))
;
