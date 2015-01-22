'use strict';

/*@ngInject*/
module.exports = function($scope, _) {

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
      console.log(cleaned);
      return answer === cleaned;
    };
  }

  $scope.checkAnswer = function() {
    var rq = $scope.ruleQuestion;
    var answer = rq.response;
    var exactMatch = _.any(rq.body, compareEntireAnswerToBody(answer));
    if (exactMatch) {
      console.log(exactMatch);
      $scope.ruleQuestion.correct = true;
      return;
    }

  };
};
