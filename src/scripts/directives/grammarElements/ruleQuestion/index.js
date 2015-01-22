'use strict';

module.exports =
angular.module('quill-grammar.directives.ruleQuestion', [])
.directive('grammarRuleQuestion', require('./directive.js'))
.filter('formatPrompt', require('./filters.js').formatPrompt)

;
