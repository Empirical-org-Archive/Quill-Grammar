function panel() {
  return {
    restrict: 'E',
    scope: {
      category: '='
    },
    templateUrl: 'category.edit.html',
    controller: 'CategoryCtrl'
  };
}

module.exports.panel = panel;

function controller($scope, cs) {
  $scope.deleteCategory = function(category) {
    return cs.deleteCategory(category).then(function() {
      console.log('deleting category ', category);
    });
  };

  $scope.editCategory = function(category) {
    console.log(category);
  };

  $scope.newRule = function(category) {
    $scope.showNewRuleModal = true;
  };

  $scope.showDeleteCategory = function() {
    $scope.showDeleteCategoryModal = true;
  };

  $scope.saveRule = function(category, rule) {
    console.log(category, rule);
  };
}

module.exports.controller = ['$scope', 'CategoryService', controller];

