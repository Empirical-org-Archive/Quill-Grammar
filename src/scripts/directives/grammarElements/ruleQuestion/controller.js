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
        return answer.indexOf(element) !== -1;
      });
    };
  }

  $scope.checkAnswer = function() {
    var rq = $scope.ruleQuestion;
    var answer = rq.response;
    var exactMatch = _.any(rq.body, compareEntireAnswerToBody(answer));
    if (exactMatch) {
      setMessage('Correct!');
      $scope.ruleQuestion.correct = true;
      return;
    }
    var grammarMatch = _.any(rq.body, compareGrammarElementToBody(answer));
    if (grammarMatch && !strictTypingMode) {
      setMessage('You are correct, but you have some typing errors. You may correct them or continue');
      $scope.ruleQuestion.correct = true;
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
