'use strict';
module.exports =

/*@ngInject*/
function SentencePlayCtrl(
  $scope, $state, SentenceWritingService, RuleService, _
) {
  $scope.id = $state.params.id;

  SentenceWritingService.getSentenceWriting($scope.id).then(function(sw) {
    var ruleIds = _.pluck(sw.rules, 'ruleId');
    var quantities = _.pluck(sw.rules, 'quantity');
    RuleService.getRules(ruleIds).then(function(resolvedRules) {

      $scope.swSet = _.chain(resolvedRules)
        .map(function(rr, i) {
          rr.selectedRuleQuestions = _.sample(rr.resolvedRuleQuestions, quantities[i]);
          return rr;
        })
        .value();

      $scope.questions = _.chain($scope.swSet)
        .pluck('selectedRuleQuestions')
        .flatten()
        .value();

      $scope.currentRuleQuestion = $scope.questions[0];
    }, function() {
      //errorStateChange();
    });
  }, function() {
    //errorStateChange();
  });

  function errorStateChange() {
    $state.go('index');
  }
};
