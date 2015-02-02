'use strict';

module.exports =

/*@ngInject*/
function sentences($scope, CategoryService, $state, RuleService, _) {
  $scope.newSentence = {};
  $scope.flags = [{$id:1, title: 'Production'}, {$id:2, title:'Beta'}];

  CategoryService.getCategories().then(function(cats) {
    $scope.availableCategories = cats;
  });

  $scope.nextStep = function() {
    var ruleIds = $scope.newSentence.category.rules;
    RuleService.getRules(ruleIds).then(function(rules) {
      $scope.availableRules = rules;
      $state.go('^.questions');
    });
  };

  $scope.addRule = function(r) {
    if (!$scope.newSentence.rules) {
      $scope.newSentence.rules = [];
    }
    if (_.find($scope.newSentence.rules, r)) {
      throw new Error('Cannot have two instances of the same rule ' + r.title);
    } else {
      $scope.newSentence.rules.push(r);
    }
  };

  $scope.removeRule = function(r) {
    if ($scope.newSentence.rules) {
      $scope.newSentence.rules = _.without($scope.newSentence.rules, r);
    }
  };

};
