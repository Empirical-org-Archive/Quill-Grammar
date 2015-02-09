'use strict';
module.exports =

/*@ngInject*/
function SentencePlayCtrl(
  $scope, $state, SentenceWritingService, RuleService, _
) {
  $scope.id = $state.params.id;

  SentenceWritingService.getSentenceWriting($scope.id).then(function(sw) {
    console.log(sw);
    var ruleIds = _.pluck(sw.rules, 'ruleId');
    var quantities = _.pluck(sw.rules, 'quantity');
    console.log(ruleIds);
    RuleService.getRules(ruleIds).then(function(resolvedRules) {
      $scope.swSet = _.chain(resolvedRules)
        .map(function(rr, i) {
          rr.selectedRuleQuestions = _.sample(rr.resolvedRuleQuestions, quantities[i]);
          return rr;
        })
        .value();
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
