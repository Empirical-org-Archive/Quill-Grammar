'use strict';

/*@ngInject*/
module.exports = function ($scope, _, $timeout, Question) {
  function setMessage(msg) {
    $scope.question.message = msg;
  }

  var CheckButtonText = {
    DEFAULT: 'Check Work',
    TRY_AGAIN: 'Recheck Work'
  };

  $scope.$watch('question.$id', function () {
    $scope.checkAnswerText = CheckButtonText.DEFAULT;
    $scope.questionClass = 'default';
    $scope.showCheckAnswerButton = true;
    $timeout.cancel($scope.shortAnswerPromise);
  });

  $scope.checkAnswer = function () {
    var rq = $scope.question;
    rq.checkAnswer();
    console.log(rq.status);
    setMessage(rq.getResponseMessage());
    $timeout.cancel($scope.shortAnswerPromise);
    switch (rq.status) {
      case Question.ResponseStatus.NO_ANSWER: {
        $scope.questionClass = 'try_again';
        $scope.checkAnswerText = CheckButtonText.TRY_AGAIN;
        $scope.shortAnswerPromise = $timeout(function () {
          setMessage('');
          $scope.questionClass = 'default';
        }, 3000);
        break;
      }
      case Question.ResponseStatus.CORRECT: {
        $scope.checkAnswerText = CheckButtonText.DEFAULT;
        $scope.questionClass = 'correct';
        $scope.showCheckAnswerButton = false;
        $scope.showNextQuestion = true;
        $scope.submit();
        break;
      }
      case Question.ResponseStatus.TYPING_ERROR_NON_STRICT: {
        $scope.checkAnswerText = CheckButtonText.DEFAULT;
        $scope.questionClass = 'correct';
        $scope.showCheckAnswerButton = false;
        $scope.showNextQuestion = true;
        $scope.submit();
        break;
      }
      case Question.ResponseStatus.TOO_MANY_ATTEMPTS: {
        $scope.questionClass = 'incorrect';
        $scope.checkAnswerText = CheckButtonText.DEFAULT;
        $scope.showCheckAnswerButton = false;
        $scope.showNextQuestion = true;
        $scope.submit();
        break;
      }
      default: {
        $scope.questionClass = 'try_again';
        $scope.checkAnswerText = CheckButtonText.TRY_AGAIN;
      }
    }
  };

  $scope.nextProblem = function () {
    $scope.showNextQuestion = false;
    $scope.showCheckAnswerButton = true;
    $scope.next(); // Defined on the directive.
  };

  /*
   * Event handler for input paste. This is to
   * prevent students from pasting into this field
   */
  $scope.capturePasteEvent = function (event) {
    event.preventDefault();
  };
};
