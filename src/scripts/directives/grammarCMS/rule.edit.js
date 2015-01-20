'use strict';

function controller($scope, rs) {
  $scope.deleteRule = function() {
    var category = $scope.category;
    var rule = $scope.rule;
    return rs.deleteRule(category, rule).then(function(){
      $scope.rule = null;
    }, function(error) {
      $scope.rule.error = error;
    });
  };

  $scope.showDeleteRule = function() {
    $scope.showDeleteRuleModal = true;
  };

  $scope.editRule = function(rule) {
    console.log("editing rule " + rule);
  };

  $scope.showRuleQuestionModal = function() {
    $scope.showNewRuleQuestionModal = true;
  };

  $scope.addPracticeQuestion = function(rule, question) {
    console.log(rule, question);
  };
  $scope.addAnswerToBody = function(question) {
    if (question && question.body && question.body.push && question.tempB) {
      question.body.push(question.tempB);
      question.tempB = null;
    }
  };

  /**
   * Init the question scope variable
   */
  $scope.question = {
    body: []
  };
}

module.exports.controller = ['$scope', 'RuleService', controller];


function panel() {
  return {
    restrict: 'E',
    controller: 'RuleCtrl',
    templateUrl: 'rule.edit.html',
  };
}

module.exports.panel = panel;

