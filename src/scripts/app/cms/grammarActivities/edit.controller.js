'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesEditCmsCtrl (
  $scope, GrammarActivity, $state, _, ConceptsFBService
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.concepts = [];

  GrammarActivity.getOneByIdFromFB($state.params.id).then(function (ga) {
    $scope.grammarActivity = ga;
    $scope.grammarActivity.concepts = _.map($scope.grammarActivity.concepts, function(c, k) {
      c.$id = k;
      ConceptsFBService.getById(k).then(function (cfb) {
        if (cfb) {
          c.concept_level_2 = cfb.concept_level_2;
          c.concept_level_1 = cfb.concept_level_1;
          c.concept_level_0 = cfb;
        }
      });
      return c;
    });
  });

  $scope.processGrammarActivityForm = function () {

  };
};
