'use strict';

/* globals confirm */
/* globals alert */
module.exports =

/*@ngInject*/
function ProofreaderActivitiesEditCmsCtrl (
  $scope, ProofreaderActivity, $state, Activity,
  proofreaderActivityClassificationUid
) {
  $scope.proofreaderActivity = {};

  ProofreaderActivity.getById($state.params.id).then(function (pa) {
    $scope.proofreaderActivity = pa;
  });

  $scope.processProofreaderActivityForm = function () {
    var pa = $scope.proofreaderActivity;
    var updatedProofreaderActivity = {
      title: pa.title,
      description: pa.description,
      standard: pa.standard,
      standard_level: pa.standard_level,
      topicCategory: pa.topicCategory,
      passage: pa.passage,
      underlineErrorsInProofreader: pa.underlineErrorsInProofreader
    };
    var id = $state.params.id;

    ProofreaderActivity.updateToFB(id, updatedProofreaderActivity).then(function () {
      var proofreaderActivityUid = id;
      var lmsActivity = new Activity({
        uid: proofreaderActivityUid,
        name: updatedProofreaderActivity.title,
        description: updatedProofreaderActivity.description,
        topic_uid: updatedProofreaderActivity.standard.uid,
        activity_classification_uid: proofreaderActivityClassificationUid
      });
      if (!lmsActivity.isValid()) {
        throw new Error(lmsActivity.errorMessages);
      }
      return lmsActivity.update();
    }).then(function () {
      $state.go('cms-proofreader-activities');
    }).catch(function (err) {
      alert(err);
    });
  };

  $scope.confirmDelete = function (id) {
    var d = confirm('Are you absolutely sure you want to delete activity: ' + id + '?');
    if (d) {
      ProofreaderActivity.deleteByIdFromFB(id).then(function () {
        $state.go('cms-proofreader-activities');
      }, function (err) {
        throw err;
      });
    }
  };
};
