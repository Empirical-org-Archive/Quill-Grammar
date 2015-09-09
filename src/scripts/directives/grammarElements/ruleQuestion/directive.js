'use strict';
module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      ruleQuestion: '=',
      next: '&',
      submit: '&'
    },
    templateUrl: 'ruleQuestion.html',
    controller: 'GrammarRuleQuestionCtrl'
  };
};
