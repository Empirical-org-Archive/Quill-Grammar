'use strict';

module.exports =

/*@ngInject*/
function ProofreaderActivitiesCmsCtrl (
  $scope, ProofreaderActivity, _
) {
  ProofreaderActivity.getAllFromFB().then(function (proofreaderActivities) {
    $scope.proofreaderActivities = proofreaderActivities;
  });

  $scope.calculateNumberOfQuestions = function (ga) {
    return _.map(ga.concepts, function (c) {
      return String(c.quantity) + '(' + String(c.ruleNumber) + ')';
    }).join(', ');
  };
};
