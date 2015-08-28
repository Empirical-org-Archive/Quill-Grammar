'use strict';

module.exports =

/*@ngInject*/
function ConceptsQuestionsEditCmsCtrl (
  $scope, $state, ConceptsFBService
) {
  if ($state.params.conceptId === null || $state.params.conceptId === '') {
    $state.go('cms-concepts');
    return;
  }

  $scope.conceptQuestion = {};
  $scope.conceptQuestion.answers = [{}];

  ConceptsFBService.getById($state.params.conceptId).then(function (c) {
    $scope.concept = c;
    ConceptsFBService.getQuestionForConcept(
      $scope.concept,
      $state.params.conceptQuestionId
    ).then(function (cq) {
      $scope.conceptQuestion = cq;
      if (!$scope.conceptQuestion.answers) {
        $scope.conceptQuestion.answers = [{}];
      }
    });
  }, function (error) {
    console.error(error);
  });

  $scope.processConceptQuestionForm = function () {
    ConceptsFBService.modifyQuestionForConcept($scope.concept, $scope.conceptQuestion).then(function () {
      $state.go('cms-concepts-view', {id: $scope.concept.$id});
    }, function (error) {
      console.error(error);
    });
  };
};
