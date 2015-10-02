'use strict';

module.exports =

/*@ngInject*/
function ProofreaderActivitiesCreateCmsCtrl (
  $scope, _, ProofreaderActivity, $state,
  Activity, proofreaderActivityClassificationUid
) {
  $scope.proofreaderActivity = {};
  $scope.proofreaderActivity.concepts = [{}];

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

  $scope.processProofreaderActivityForm = function () {
    var ga = $scope.proofreaderActivity;
    var newProofreaderActivity = {
      title: ga.title,
      description: ga.description,
      concepts: buildConcepts(ga.concepts),
      standard: ga.standard,
      standard_level: ga.standard_level,
      topicCategory: ga.topicCategory
    };

    ProofreaderActivity.addToFB(newProofreaderActivity).then(function (ref) {
      var proofreaderActivityUid = ref.key();
      var lmsActivity = new Activity({
        uid: proofreaderActivityUid,
        name: newProofreaderActivity.title,
        description: newProofreaderActivity.description,
        topic_uid: newProofreaderActivity.standard.uid,
        activity_classification_uid: proofreaderActivityClassificationUid
      });
      if (!lmsActivity.isValid()) {
        throw new Error(lmsActivity.errorMessages);
      }
      return lmsActivity.create();
    }).then(function () {
      $state.go('cms-proofreader-activities');
    });
  };
};
