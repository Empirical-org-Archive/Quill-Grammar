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

function controller($scope) {

}

module.exports.controller = ['$scope', controller];
