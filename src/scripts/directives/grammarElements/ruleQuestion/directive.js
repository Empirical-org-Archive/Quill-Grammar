'use strict';
module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      question: '=',
      next: '&',
      submit: '&'
    },
    templateUrl: 'ruleQuestion.html',
    controller: 'GrammarRuleQuestionCtrl'
  };
};
