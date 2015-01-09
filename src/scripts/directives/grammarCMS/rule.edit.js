'use strict';

function controller($scope) {
  $scope.deleteRule = function(rule) {
    console.log("deleting rule ", rule);
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
}

module.exports.controller = ['$scope', controller];


function panel() {
  return {
    restrict: 'E',
    controller: 'RuleCtrl',
    templateUrl: 'rule.edit.html',
    scope: {
      rule: '='
    }
  };
}

module.exports.panel = panel;

