'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesEditCmsCtrl (
  $scope, GrammarActivity, $state
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.concepts = {};

  GrammarActivity.getById($state.params.id).then(function (ga) {
    console.log(ga);
    $scope.grammarActivity = ga;
  });

  $scope.processGrammarActivityForm = function (ga) {
    console.log(ga);
  };
};
