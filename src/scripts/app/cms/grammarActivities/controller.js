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
    var quantities = _.pluck(ga.concepts, 'quantity');
    return _.reduce(quantities, function(a,b) {return a+b;}, 0);
  };
};
