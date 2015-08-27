'use strict';

module.exports =

angular.module('quill-grammar.play.sentences', [
  require('./../../../services/sentenceWriting.js').name,
  require('./../../../services/rule.js').name,
  require('./../../../services/category.js').name,
  require('./../../../services/analytics.js').name,
  require('./../../../services/localStorage.js').name,
  require('./../../../services/lms/conceptResult.js').name,
  'ui.router',
])
.config(require('./config.js'))
.directive('sentenceWritingConceptOverview', function () {
  return {
    restrict: 'E',
    templateUrl: 'sentences.concept-overview.html'
  };
})
.directive('sentenceWritingSubmitPanel', function () {
  return {
    restrict: 'E',
    templateUrl: 'sentences.submit-panel.html',
  };
})
.controller('ResultsController', require('./results.controller.js'))
.controller('SentencePlayCtrl', require('./controller.js'));
