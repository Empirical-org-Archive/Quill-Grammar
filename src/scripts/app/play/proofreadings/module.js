'use strict';

module.exports = angular.module('quill-grammar.play.proofreadings', [
  require('./../../../services/proofreading.js').name,
  'angular.filter',
  'uuid4',
])
.config(require('./config.js'))
.filter('passageProofreadingFormatter', require('./passageFormatter.js'))
.directive('quillGrammarPassage', function() {
  return {
    restrict: 'E',
    controller: 'ProofreadingPlayCtrl',
    scope: {
      passage: '='
    },
    templateUrl: 'passage.html'
  };
})
.directive('quillGrammarPfHeading', function() {
  return {
    restrict: 'E',
    controller: 'ProofreadingPlayCtrl',
    scope: {
      pf: '='
    },
    templateUrl: 'pf-heading.html'
  };
})
.directive('quillGrammarPassageSubmitPanel', function() {
  return {
    restrict: 'E',
    controller: 'ProofreadingPlayCtrl',
    templateUrl: 'pf-submit-panel.html'
  };
})
.directive('ngSize', require('./ngSize.js'))
.controller('ProofreadingPlayCtrl', require('./controller.js'));
