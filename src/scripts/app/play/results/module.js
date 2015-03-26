'use strict';

module.exports =

angular.module('quill-grammar.play.results', [
  require('./../directives/').name,
])
.config(require('./config.js'))
.directive('internalResultsTable', function() {
  return {
    restrict: 'E',
    templateUrl: 'internal-results-table.html',
    scope: {
      results: '=',
      title: '='
    },
    controller: 'InternalResultsCtrl'
  };
})
.controller('InternalResultsCtrl', require('./controller.js'));
