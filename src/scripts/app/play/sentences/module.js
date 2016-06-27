'use strict';

module.exports =

angular.module('quill-grammar.play.sentences', [
  require('./../../../services/analytics.js').name,
  require('./../../../services/localStorage.js').name,
  require('./../../../services/lms/conceptResult.js').name,
  require('./../../../services/v2/grammarActivity.js').name,
  require('../../../../../.tmp/config').name,
  'ui.router',
])
.config(require('./config.js'))
.directive('sentenceWritingConceptOverview', function () {
  return {
    restrict: 'E',
    templateUrl: 'sentences.concept-overview.html'
  };
})
.controller('ResultsController', require('./results.controller.js'))
.controller('SentencePlayCtrl', require('./controller.js'));
