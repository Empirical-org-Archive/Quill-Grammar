'use strict';
module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      question: '=',
      next: '&',
      submit: '&',
      report: '&'
    },
    templateUrl: 'ruleQuestion.html',
    controller: 'GrammarRuleQuestionCtrl'
  };
};
