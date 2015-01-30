'use strict';

module.exports =

/*@ngInject*/
function sentences($scope, CategoryService, $state) {
  $scope.newSentence = {};
  $scope.flags = [{$id:1, title: 'Production'}, {$id:2, title:'Beta'}];

  CategoryService.getCategories().then(function(cats) {
    $scope.availableCategories = cats;
  });

  $scope.nextStep = function() {
    $state.go('^.questions');
  };
};
