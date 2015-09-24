'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesCreateCmsCtrl (
  $scope, _, GrammarActivity, $state,
  Activity, grammarActivityClassificationUid
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.concepts = [{}];

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
    var newGrammarActivity = {
      title: ga.title,
      description: ga.description,
      concepts: buildConcepts(ga.concepts),
      standard: ga.standard,
      standard_level: ga.standard_level,
      topicCategory: ga.topicCategory
    };

    GrammarActivity.addToFB(newGrammarActivity).then(function (ref) {
      var grammarActivityUid = ref.key();
      var lmsActivity = new Activity({
        uid: grammarActivityUid,
        name: newGrammarActivity.title,
        description: newGrammarActivity.description,
        topic_uid: newGrammarActivity.standard.uid,
        activity_classification_uid: grammarActivityClassificationUid
      });
      if (!lmsActivity.isValid()) {
        throw new Error(lmsActivity.errorMessages);
      }
      return lmsActivity.create();
    }).then(function () {
      $state.go('cms-grammar-activities');
    });
  };
};
