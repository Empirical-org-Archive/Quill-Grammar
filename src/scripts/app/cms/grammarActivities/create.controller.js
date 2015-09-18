'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesCreateCmsCtrl (
  $scope, _, GrammarActivity, $state
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.concepts = [{}];

  function buildConcepts(set) {
    return _.chain(set)
      .map(function (s) {
        return [s.concept_level_0.$id, {
          quantity: s.number_of_questions,
          ruleNumber: s.concept_level_0.ruleNumber
        }];
      })
      .object()
      .value();
  }

  $scope.processGrammarActivityForm = function () {
    var ga = $scope.grammarActivity;
    var newGrammarActivity = {
      title: ga.title,
      description: ga.description,
      concepts: buildConcepts(ga.concepts),
      standard: ga.standard,
      standard_level: ga.standard_level,
      theme: ga.theme
    };


    GrammarActivity.addToFB(newGrammarActivity).then(function () {
      $state.go('cms-grammar-activities');
    });
  };
};
