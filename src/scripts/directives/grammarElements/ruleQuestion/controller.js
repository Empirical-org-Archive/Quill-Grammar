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

  function setCorrect() {
    $scope.ruleQuestion.correct = true;
    $scope.$emit('correctRuleQuestion', $scope.ruleQuestion);
  }

  function ensureLengthIsProper(answer) {
    var threshold = 0.8;
    return function(body) {
      var b = body.replace(delim.open, '').replace(delim.close, '');
      return (answer.length / b.length) >= threshold;
    };
  }

  $scope.checkAnswer = function() {
    var rq = $scope.ruleQuestion;
    var answer = rq.response;
    var exactMatch = _.any(rq.body, compareEntireAnswerToBody(answer));
    if (exactMatch) {
      setMessage('Correct!');
      setCorrect();
      return;
    }
    var grammarMatch = _.any(rq.body, compareGrammarElementToBody(answer));
    var answerIsAdequateLength = _.every(rq.body, ensureLengthIsProper(answer));
    if (!answerIsAdequateLength) {
      setMessage('Your answer is not long enough. Try again!');
      return;
    }
    if (grammarMatch && !strictTypingMode) {
      setMessage('You are correct, but you have some typing errors. You may correct them or continue');
      setCorrect();
      return;
    } else if (grammarMatch) {
      setMessage('You are correct, but have some typing errors. Please fix them.');
    }

    setMessage('Try again!');
  };

  function setMessage(msg) {
    $scope.ruleQuestion.message = msg;
  }
};
