'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesEditCmsCtrl (
  $scope, GrammarActivity, $state
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.concepts = {};

  GrammarActivity.getActivityByIdFromFB($state.id).then(function (ga) {
    $scope.grammarActivity = ga;
  });
};
