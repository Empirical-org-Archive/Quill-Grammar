'use strict';

/*@ngInject*/
module.exports = function ($scope, _, $timeout, Question, TypingSpeed) {
  function setMessage(msg) {
    $scope.responseMessage = msg;
  }

  var CheckButtonText = {
    DEFAULT: 'Check Work',
    TRY_AGAIN: 'Recheck Work'
  };

  // Default values.
  function resetSubmitPanel() {
    setMessage('');
    $scope.checkAnswerText = CheckButtonText.DEFAULT;
    $scope.questionClass = 'default';
    $scope.showCheckAnswerButton = true;
    $scope.showCheckOrContinueButton = false;
    $scope.showNextQuestion = false;
    $timeout.cancel($scope.shortAnswerPromise);
  }

  function submitAnswer() {
    $scope.showCheckAnswerButton = false;
    $scope.showCheckOrContinueButton = false;
    $scope.showNextQuestion = true;
    $scope.submit();
  }

  function submitLooseAnswer() {
    $scope.showCheckAnswerButton = false;
    $scope.showCheckOrContinueButton = true;
  }

  resetSubmitPanel();

  $scope.resetWPM = function () {
    TypingSpeed.reset();
  };

  $scope.startEditing = function () {
    $scope.attempting = true;
  };

  $scope.checkAnswer = function () {
    var rq = $scope.question;
    if (rq) {
      rq.checkAnswer();
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
          submitAnswer();
          break;
        }
        case Question.ResponseStatus.TYPING_ERROR_NON_STRICT: {
          $scope.checkAnswerText = CheckButtonText.TRY_AGAIN;
          $scope.questionClass = 'try_again';
          // submitAnswer();
          break;
        }
        case Question.ResponseStatus.TYPING_ERROR_NON_STRICT_UNFIXED: {
          $scope.checkAnswerText = CheckButtonText.DEFAULT;
          $scope.questionClass = 'try_again';
          $scope.attempting = false;
          submitAnswer();
          break;
        }
        case Question.ResponseStatus.TOO_MANY_ATTEMPTS: {
          $scope.questionClass = 'incorrect';
          $scope.checkAnswerText = CheckButtonText.DEFAULT;
          $scope.$emit('showModal');
          submitAnswer();
          break;
        }
        default: {
          $scope.questionClass = 'try_again';
          $scope.checkAnswerText = CheckButtonText.TRY_AGAIN;
        }
      }
    }
  };

  $scope.nextProblem = function () {
    $scope.showNextQuestion = false;
    $scope.showConfirmation = false;
    $scope.errorReport = '';
    resetSubmitPanel();
    $scope.$emit('hideModal');
    $scope.next(); // Defined on the directive.
  };

  $scope.checkOrContinue = function () {
    if ($scope.attempting) {
      $scope.checkAnswer();
    } else {
      $scope.submit();
      $scope.nextProblem();
    }
  };

  /*
   * Event handler for input paste. This is to
   * prevent students from pasting into this field
   */
  $scope.capturePasteEvent = function (event) {
    event.preventDefault();
  };

  /*
   * Event handler for pressing enter while focuesed
   * in the textarea to check answer or progress to
   * the next problem
   */
  $scope.capturePressEnterEvent = function () {
    if ($scope.showNextQuestion) {
      $scope.nextProblem();
    } else if ($scope.showCheckOrContinueButton) {
      $scope.checkOrContinue();
    } else {
      $scope.checkAnswer();
    }
  };

  $scope.sendErrorReport = function () {
    $scope.report();
    $scope.showReport = false;
    $scope.showConfirmation = true;
  };
};
