'use strict';

module.exports =

/*@ngInject*/
function sentences($scope, CategoryService, $state, RuleService) {
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


};
