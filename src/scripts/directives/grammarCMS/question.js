'use strict';

function show() {
  return {
    restrict: 'E',
    templateUrl: 'question.show.html',
    scope: {
      question: '='
    },
  };
}

module.exports.show = show;

function panel() {
  return {
    restrict: 'E',
    controller: 'QuestionCtrl',
    templateUrl: 'question.edit.html',
    scope: {
      question: '='
    }
  };
}

module.exports.panel = panel;

function controller($scope, rqs) {
  $scope.showDeleteRuleQuestion = function() {
    $scope.showDeleteRuleQuestionModal = true;
  };

  $scope.deleteRuleQuestion = function(question) {
    var rule = $scope.rule;
    return rqs.deleteRuleQuestion(question, rule).then(function(){

    });
  };
}

module.exports.controller = ['$scope', 'RuleQuestionService', controller];
