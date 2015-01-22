'use strict';
module.exports =

/*@ngInject*/
function index ($scope, RuleQuestionService) {
  RuleQuestionService._getAllRuleQuestionsWithInstructions().then(function(questions) {
    var i = 39;
    $scope.showNextQuestion = false;
    $scope.showPreviousQuestion = false;
    $scope.currentRuleQuestion = questions[i];
    $scope.nextQuestion = function() {
      $scope.currentRuleQuestion = questions[++i];
    };
    $scope.previousQuestion = function() {
      $scope.currentRuleQuestion = questions[--i];
    };

    $scope.$watch('currentRuleQuestion', function() {
      if (!$scope.currentRuleQuestion) {
        $scope.finish();
      }
      $scope.showNextQuestion =
        i < questions.length &&
        ($scope.currentRuleQuestion && $scope.currentRuleQuestion.correct);

      $scope.showPreviousQuestion = i > 0;
    }, true);

    $scope.finish = function() {
      console.log(i);
      console.log('Thanks for playing');
      $scope.showNextQuestion = false;
      $scope.showPreviousQuestion = false;
    };
  });
};
