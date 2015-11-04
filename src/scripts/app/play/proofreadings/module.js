'use strict';

module.exports = angular.module('quill-grammar.play.proofreadings', [
  require('./../../layout/layout.module.js').name, // Need to include this for the parent 'app' route.
  require('./../../../services/v2/proofreaderActivity.js').name,
  require('./../../../services/v2/passageWord.js').name,
  require('./../../../services/v2/proofreadingPassage.js').name,
  require('./../../../services/finalize.js').name,
  'LocalStorageModule',
  'angulartics',
  'angular.filter',
  'ui.router',
  'uuid4'
])
.config(require('./config.js'))
.directive('quillGrammarPassage', function () {
  return {
    restrict: 'E',
    templateUrl: 'passage.html'
  };
})
.directive('quillGrammarPfHeading', function () {
  return {
    restrict: 'E',
    templateUrl: 'pf-heading.html'
  };
})
.directive('quillGrammarPassageSubmitPanel', function () {
  return {
    restrict: 'E',
    templateUrl: 'pf-submit-panel.html'
  };
})
.directive('ngSize', require('./ngSize.js'))
.directive('proofreadingErrorTooltip', require('./errorTooltip/directive.js'))
.directive('passageWordInput', require('./passageWordInput/directive.js'))
.controller('ProofreadingPlayCtrl', require('./controller.js'));
