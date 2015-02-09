'use strict';
module.exports =

/*@ngInject*/
function SentencePlayCtrl(
  $scope, $state, SentenceWritingService, RuleService, _
) {
  $scope.id = $state.params.id;

  $scope.$watch('currentRuleQuestion', function(crq) {
    if (_.isObject(crq)) {
      $scope.currentRule = $scope.swSet[crq.ruleIndex];
    }
  });

  $scope.$on('correctRuleQuestion', function(crq) {
    console.log(crq);
  });

  SentenceWritingService.getSentenceWriting($scope.id).then(function(sw) {
    $scope.sentenceWriting = sw;
    var ruleIds = _.pluck(sw.rules, 'ruleId');
    var quantities = _.pluck(sw.rules, 'quantity');
    RuleService.getRules(ruleIds).then(function(resolvedRules) {
      $scope.swSet = _.chain(resolvedRules)
        .map(function(rr, i) {
          rr.selectedRuleQuestions = _.chain(rr.resolvedRuleQuestions)
            .sample(quantities[i])
            .map(function(rrq) {
              rrq.ruleIndex = i;
              return rrq;
            })
            .value();
          return rr;
        })
        .value();

      $scope.questions = _.chain($scope.swSet)
        .pluck('selectedRuleQuestions')
        .flatten()
        .value();

      $scope.currentRuleQuestion = $scope.questions[0];
      $scope.showNextQuestion = false;
      $scope.showPreviousQuestion = false;
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
