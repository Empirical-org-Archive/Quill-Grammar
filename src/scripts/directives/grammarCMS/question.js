'use strict';

function show() {
  return {
    restrict: 'E',
    templateUrl: 'question.show.html'
  };
}

module.exports.show = show;

function panel() {
  return {
    restrict: 'E',
    controller: 'QuestionCtrl',
    templateUrl: 'question.edit.html',
  };
}

module.exports.panel = panel;

function controller($scope, rqs, rs) {
  $scope.showDeleteRuleQuestion = function () {
    $scope.showDeleteRuleQuestionModal = true;
  };

  $scope.deleteRuleQuestion = function (question) {
    var rule = $scope.rule;
    return rqs.deleteRuleQuestion(question).then(function () {
      return rs.removeRuleQuestionFromRule(rule, question);
    });
  };
}

module.exports.controller = ['$scope', 'RuleQuestionService', 'RuleService', controller];
