module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      ruleQuestion: '='
    },
    templateUrl: 'ruleQuestion.html',
    controller: 'GrammarRuleQuestionCtrl'
  };
};
