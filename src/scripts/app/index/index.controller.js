'use strict';
module.exports =

/*@ngInject*/
function index ($scope, RuleQuestionService) {
  RuleQuestionService._getAllRuleQuestionsWithInstructions().then(function(questions) {
    var i = 0;
    $scope.currentRuleQuestion = questions[i];
    $scope.nextQuestion = function() {
      $scope.currentRuleQuestion = questions[++i];
    };
    $scope.previousQuestion = function() {
      $scope.currentRuleQuestion = questions[--i];
    };

    $scope.$watch('currentRuleQuestion', function() {
      console.log($scope.currentRuleQuestion);
      if (!$scope.currentRuleQuestion) {
        $scope.finish();
      }
    });

    $scope.finish = function() {
      console.log(i);
      console.log('Thanks for playing');
    };
  });
};
