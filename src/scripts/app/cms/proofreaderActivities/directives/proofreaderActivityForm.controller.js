'use strict';

module.exports =

  /*
   * This directive expects proofreaderActivity, proofreaderActivity.concepts,
   * and processProofreaderActivityForm to be set in scope. The use cases here
   * are the create grammar activity and edit grammar activity controller
   * modules.
   */

/*@ngInject*/
function ProofreaderActivityFormCtrl (
  $scope, _, TopicCategoryService
) {
  $scope.concepts = {};

  TopicCategoryService.get().then(function (topicCategories) {
    $scope.topicCategories = topicCategories;
  });

  $scope.removeQuestionFromSet = function (qs) {
    if ($scope.proofreaderActivity.concepts) {
      $scope.proofreaderActivity.concepts = _.without(
        $scope.proofreaderActivity.concepts, qs
      );
    }
  };
  $scope.addAnotherQuestionToSet = function () {
    $scope.proofreaderActivity.concepts.push({});
  };
};
