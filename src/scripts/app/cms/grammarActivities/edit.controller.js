'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesEditCmsCtrl (
  $scope, GrammarActivity, $state, _
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.concepts = [];

  GrammarActivity.getOneByIdFromFB($state.params.id).then(function (ga) {
    $scope.grammarActivity = ga;
    $scope.grammarActivity.concepts = _.map($scope.grammarActivity.concepts, function(c, k) {
      c.fb_concept_key = k;
      return c;
    });
  });

  $scope.processGrammarActivityForm = function () {

  };
};
