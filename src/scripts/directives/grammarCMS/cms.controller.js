'use-strict';

  
  
function cmsController($scope) {

  /*
   * $scope initializers
   */
  $scope.categories = [{title:'hey'}];

  $scope.saveCategory = function(category) {

  };

}

module.exports = ['$scope', cmsController];
