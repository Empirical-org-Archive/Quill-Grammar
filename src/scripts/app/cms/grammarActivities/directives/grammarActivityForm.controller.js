'use strict';

module.exports =

  /*
   * This directive expects grammarActivity, grammarActivity.concepts,
   * and processGrammarActivityForm to be set in scope. The use cases here
   * are the create grammar activity and edit grammar activity controller
   * modules.
   */

/*@ngInject*/
function GrammarActivityFormCtrl (
  $scope, _, TopicCategoryService
) {
  $scope.concepts = {};

  TopicCategoryService.get().then(function (topicCategories) {
    $scope.topicCategories = topicCategories;
  });

  $scope.removeQuestionFromSet = function (qs) {
    if ($scope.grammarActivity.concepts) {
      $scope.grammarActivity.concepts = _.without(
        $scope.grammarActivity.concepts, qs
      );
    }
  };
  $scope.addAnotherQuestionToSet = function () {
    $scope.grammarActivity.concepts.push({});
  };
};
