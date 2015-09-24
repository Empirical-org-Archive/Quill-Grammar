'use strict';
module.exports =

/*@ngInject*/
function index ($scope, ConceptsFBService, _, Question) {
  ConceptsFBService.get().then(function (concepts) {
    var i = 0;
    var currentConcept = concepts[i];
    function questionFromConcept(concept) {
      var randomQuestionData = _.sample(concept.questions);
      return new Question(randomQuestionData);
    }
    $scope.showNextQuestion = false;
    $scope.showPreviousQuestion = false;
    $scope.currentQuestion = questionFromConcept(currentConcept);
    $scope.nextQuestion = function () {
      currentConcept = concepts[++i];
      $scope.currentQuestion = questionFromConcept(currentConcept);
    };
    $scope.previousQuestion = function () {
      currentConcept = concepts[--i];
      $scope.currentQuestion = questionFromConcept(currentConcept);
    };

    $scope.$watch('currentQuestion', function () {
      if (!$scope.currentQuestion) {
        $scope.finish();
      }
      $scope.showNextQuestion =
        i < concepts.length &&
        ($scope.currentQuestion && $scope.currentQuestion.correct);

      $scope.showPreviousQuestion = i > 0;
    }, true);

    $scope.finish = function () {
      console.log(i);
      console.log('Thanks for playing');
      $scope.showNextQuestion = false;
      $scope.showPreviousQuestion = false;
    };
  });
};
