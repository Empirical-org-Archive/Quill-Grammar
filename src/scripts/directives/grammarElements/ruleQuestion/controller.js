'use strict';

/*@ngInject*/
module.exports = function($scope, _) {

  var strictTypingMode = false;

  var delim = {
    open: '{',
    close: '}'
  };

  function removeDelimeters(b) {
    if (typeof(b) !== 'string') {
      throw new Error('Input must be type string removeDelimeters');
    }
    return b.replace(delim.open, '').replace(delim.close, '');
  }

  function compareEntireAnswerToBody(answer) {
    return function(b) {
      var cleaned = removeDelimeters(b);
      return answer === cleaned;
    };
  }

  function compareGrammarElementToBody(answer) {
    return function(b) {
      if (!answer) {
        return false;
      }
      //This regex will only work for one occurence of {hey grammar element}
      //It needs to be changed for when the grammar elements are more than one
      //per body line.
      var reg = new RegExp(delim.open + '(.*)' + delim.close, 'g');
      //[0]original string [1-n]substring matches
      var results = reg.exec(b);
      var grammarElements = _.rest(results);

      return _.every(grammarElements, function(element) {
        var r = new RegExp('(^|\\W{1,1})' + element + '(\\W{1,1}|$)', 'g');
        return answer.search(r) !== -1;
      });
    };
  }

  function ensureLengthIsProper(answer) {
    var threshold = 0.8;
    return function(body) {
      var b = body.replace(delim.open, '').replace(delim.close, '');
      return (answer.length / b.length) >= threshold;
    };
  }

  $scope.answerText = {
    default: 'Check Work',
    notLongEnough: '<b>Try again!</b>Your answer is not long enough.',
    tryAgain: '<b>Try Again!</b> Unfortunately, that answer is incorrect.',
    tryAgainButton: 'Recheck Work',
    typingErrorNonStrict: 'You are correct, but you have some typing errors. You may correct them or continue.',
    typingErrorStrict: 'You are correct, but have some typing errors. Please fix them.',
    incorrectWithAnswer: function(answer) {
      return '<b>Incorrect.</b> Correct Answer: ' + answer;
    },
    correct: '<b>Well done!</b> That\'s the correct answer.'
  };

  $scope.$watch('ruleQuestion.$id', function() {
    $scope.checkAnswerText = $scope.answerText.default;
    $scope.ruleQuestionClass = 'default';
    $scope.showCheckAnswerButton = true;
  });

  $scope.checkAnswer = function() {
    var rq = $scope.ruleQuestion;
    var answer = rq.response;
    var correct = false;
    if (!answer) {
      return;
    }
    var exactMatch = _.any(rq.body, compareEntireAnswerToBody(answer));
    if (exactMatch) {
      setMessage($scope.answerText.correct);
      $scope.ruleQuestionClass = 'correct';
      correct = true;
    } else {
      var grammarMatch = _.any(rq.body, compareGrammarElementToBody(answer));
      var answerIsAdequateLength = _.every(rq.body, ensureLengthIsProper(answer));
      if (!answerIsAdequateLength) {
        setMessage($scope.answerText.notLongEnough);
        $scope.ruleQuestionClass = 'try_again';
      }
      if (grammarMatch && !strictTypingMode) {
        setMessage($scope.answerText.typingErrorNonStrict);
        $scope.ruleQuestionClass = 'correct';
        correct = true;
      } else if (grammarMatch) {
        $scope.ruleQuestionClass = 'try_again';
        setMessage($scope.answerText.typingErrorStrict);
      } else {
        $scope.ruleQuestionClass = 'try_again';
        setMessage($scope.answerText.tryAgain);
      }
    }
    if (rq.attempts) {
      rq.attempts++;
    } else {
      rq.attempts = 1;
    }
    if (correct || rq.attempts >= 2) {
      $scope.$emit('answerRuleQuestion', rq, answer, correct);
      $scope.showCheckAnswerButton = false;
      if (!correct) {
        setMessage($scope.answerText.incorrectWithAnswer('correct answer here'));
        $scope.ruleQuestionClass = 'incorrect';
      }
    } else if (!correct) {
      $scope.$emit('answerRuleQuestionIncorrect', rq);
      $scope.checkAnswerText = $scope.answerText.tryAgainButton;
    }
  };

  function setMessage(msg) {
    $scope.ruleQuestion.message = msg;
  }

  /*
   * Event handler for input paste. This is to
   * prevent students from pasting into this field
   */
  $scope.capturePasteEvent = function(event) {
    event.preventDefault();
  };
};
