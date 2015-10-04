'use strict';

module.exports =

/*@ngInject*/
function ProofreaderActivitiesCreateCmsCtrl (
  $scope, _, ProofreaderActivity, $state,
  Activity, proofreaderActivityClassificationUid
) {
  $scope.proofreaderActivity = {};

  $scope.processProofreaderActivityForm = function () {
    var newProofreaderActivity = $scope.proofreaderActivity;

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
