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

function controller($scope, $q) {
  $scope.deleteCategory = function(category) {
    console.log(category);
    var p = $q.defer();
    p.resolve();
    return p.promise;
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
}

module.exports.controller = ['$scope', controller];

