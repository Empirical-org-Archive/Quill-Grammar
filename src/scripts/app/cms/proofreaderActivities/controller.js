'use strict';

module.exports =

/*@ngInject*/
function ProofreaderActivitiesCmsCtrl (
  $scope, ProofreaderActivity
) {
  ProofreaderActivity.getAllFromFB().then(function (proofreaderActivities) {
    $scope.proofreaderActivities = proofreaderActivities;
  });
};
