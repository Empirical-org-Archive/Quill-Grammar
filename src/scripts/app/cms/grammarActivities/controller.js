'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesCmsCtrl (
  $scope, GrammarActivity, _
) {
  GrammarActivity.getAllFromFB().then(function (grammarActivities) {
    $scope.grammarActivities = grammarActivities;
  });

  $scope.calculateNumberOfQuestions = function (ga) {
    return _.map(ga.concepts, function(c) {
      return String(c.quantity) + '(' + String(c.ruleNumber) + ')';
    }).join(', ');
  };
};
