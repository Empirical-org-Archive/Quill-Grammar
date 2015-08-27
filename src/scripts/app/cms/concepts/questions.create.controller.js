'use strict';

module.exports =

/*@ngInject*/
function ConceptsQuestionsCreateCmsCtrl (
  $scope, $state, ConceptsFBService
) {
  if ($state.params.conceptId === null || $state.params.conceptId === '') {
    $state.go('cms-concepts');
    return;
  }

  ConceptsFBService.getById($state.params.conceptId).then(function (c) {
    $scope.concept = c;
  }, function (error) {
    console.error(error);
  });

  $scope.conceptQuestion = {};
  $scope.conceptQuestion.answers = [{}];

  $scope.processConceptQuestionForm = function() {
    ConceptsFBService.addQuestionToConcept($scope.concept, $scope.conceptQuestion).then(function () {
      console.log('success');
    }, function (error) {
      console.error(error);
    });
  };
};
