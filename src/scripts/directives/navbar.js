'use strict';

/*@ngInject*/
module.exports.directive = function () {
  return {
    restrict: 'E',
    templateUrl: 'navbar.html',
    controller: 'NavbarCtrl'
  };
};

/*@ngInject*/
module.exports.controller = function ($scope, empiricalBaseURL) {
  $scope.baseRoute = function () {
    return empiricalBaseURL.split("api")[0]
  };
};
