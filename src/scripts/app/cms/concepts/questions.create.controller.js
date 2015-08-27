'use strict';

module.exports =

/*@ngInject*/
function ConceptsQuestionsCreateCmsCtrl (
  $scope, $state, ConceptsFBService
) {
  if ($state.params.concept_id === null || $state.params.concept_id === '') {
    $state.go('cms-concepts');
    return;
  }

  ConceptsFBService.getById($state.params.id).then(function (c) {
    $scope.concept = c;
  });

  $scope.conceptQuestion = {};
  $scope.conceptQuestion.answers = [{}];

  $scope.processConceptQuestionForm = function() {
    console.log($scope.conceptQuestion);
  };
};
