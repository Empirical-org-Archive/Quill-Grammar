'use strict';

module.exports =

/*@ngInject*/
function ErrorReportsCmsCtrl (
  $scope, _, firebaseUrl, $firebaseArray
) {
  var ref = new Firebase(firebaseUrl + '/errorReports');

  function errorReports() {
    return $firebaseArray(ref);
  }

  $scope.list = errorReports();
};
