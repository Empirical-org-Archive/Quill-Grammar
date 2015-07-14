'use strict';

module.exports = angular.module('quill-grammar.play.proofreadings', [
  require('./../../layout/layout.module.js').name, // Need to include this for the parent 'app' route.
  require('./../directives/').name,
  require('./../../../services/proofreading.js').name,
  require('./../../../services/category.js').name,
  require('./../../../services/finalize.js').name,
  'LocalStorageModule',
  'angulartics',
  'angular.filter',
  'ui.router',
  'uuid4',
])
.config(require('./config.js'))
.filter('passageProofreadingFormatter', require('./passageFormatter.js'))
.directive('quillGrammarPassage', function () {
  return {
    restrict: 'E',
    controller: 'ProofreadingPlayCtrl',
    scope: {
      passage: '=',
      numChanges: '=',
    },
    templateUrl: 'passage.html'
  };
})
.directive('quillGrammarPfHeading', function () {
  return {
    restrict: 'E',
    controller: 'ProofreadingPlayCtrl',
    scope: {
      pf: '=',
      numChanges: '=',
    },
    templateUrl: 'pf-heading.html'
  };
})
.directive('quillGrammarPassageSubmitPanel', function () {
  return {
    restrict: 'E',
    controller: 'ProofreadingPlayCtrl',
    templateUrl: 'pf-submit-panel.html'
  };
})
.directive('ngSize', require('./ngSize.js'))
.controller('PartnerPlayCtrl', require('./partner-play-ctrl.js'))
.controller('ProofreadingPlayCtrl', require('./controller.js'));
