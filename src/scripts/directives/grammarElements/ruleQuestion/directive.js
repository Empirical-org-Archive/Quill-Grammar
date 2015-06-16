'use strict';
module.exports = function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      ruleQuestion: '='
    },
    templateUrl: 'ruleQuestion.html',
    controller: 'GrammarRuleQuestionCtrl'
  };
};
