'use strict';

function controller($scope) {

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

