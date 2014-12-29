'use strict';

function ruleShow() {
  return {
    restrict: 'E',
    templateUrl: 'rule.show.html',
    controller: 'GrammarCmsCtrl',
    scope: {
      rule: '='
    }
  };
}

module.exports = ruleShow;
