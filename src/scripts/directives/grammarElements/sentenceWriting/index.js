'use strict';

module.exports =

angular.module('quill-grammar.directives.sentenceWriting', [
  require('../ruleQuestion/').name,
])
.directive('grammarSentenceWriting', require('./directive.js'))
.controller('GrammarSentenceWritingCtrl', require('./controller.js'))

;
