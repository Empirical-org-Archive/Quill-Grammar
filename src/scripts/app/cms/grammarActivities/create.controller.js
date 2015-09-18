'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesCreateCmsCtrl (
  $scope, _
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.question_set = [{}];

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
    console.log('Processing ', $scope.grammarActivity);
    var ga = $scope.grammarActivity;
    var newGrammarActivity = {
      title: ga.title,
      description: ga.description,
      concepts: buildConcepts(ga.question_set)
    };

    console.log(newGrammarActivity);

  };
};
