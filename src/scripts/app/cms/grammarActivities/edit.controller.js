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

  function buildConcepts(set) {
    return _.chain(set)
      .map(function (s) {
        return [s.concept_level_0.$id, {
          quantity: Number(s.quantity),
          ruleNumber: s.concept_level_0.ruleNumber
        }];
      })
      .object()
      .value();
  }

  $scope.processGrammarActivityForm = function () {
    var ga = $scope.grammarActivity;
    var id = $state.params.id;
    var updatedGrammarActivity = {
      title: ga.title,
      description: ga.description,
      concepts: buildConcepts(ga.concepts),
      standard: ga.standard,
      standard_level: ga.standard_level,
      topicCategory: ga.topicCategory
    };

    GrammarActivity.updateToFB(id, updatedGrammarActivity).then(function () {
      $state.go('cms-grammar-activities');
    });
  };
};
