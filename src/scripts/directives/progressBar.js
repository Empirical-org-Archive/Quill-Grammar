'use strict';

/*@ngInject*/
module.exports.directive = function() {
  return {
    restrict: 'E',
    scope: {
      title: '=',
      max: '=',
      current: '=',
    },
    controller: 'ProgressBarCtrl',
    templateUrl: 'progress-bar.html'
  };
};

/*@ngInject*/
module.exports.controller = function($scope) {

  function calculate() {
    $scope.progressString = String($scope.current) + ' of ' + String($scope.max);
    $scope.progressBarPercentage = {
      width: String(($scope.current / $scope.max) * 100) + '%'
    };
  }

  $scope.$watch('max', calculate);
  $scope.$watch('current', calculate);

  calculate();
};
