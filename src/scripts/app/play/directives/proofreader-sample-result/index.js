'use strict';

module.exports =
/*@ngInject*/
angular.module('quill-grammar.play.directives.proofreader', [])
.directive('proofreaderSampleResult', function() {
  return {
    restrict: 'E',
    templateUrl: 'proofreader-sample-result.html',
    scope: {
      uid: '='
    },
    controller: 'ProofreadingDirCtrl'
  };
})
.controller('ProofreadingDirCtrl', function(
  $scope, localStorageService
) {
  var pfResults = localStorageService.get('pf-' + $scope.uid);
  var swResults = localStorageService.get('sw-' + $scope.uid);
  console.log(pfResults, swResults);
});
