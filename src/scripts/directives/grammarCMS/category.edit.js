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

function controller($scope) {
  $scope.deleteCategory = function(category) {
    console.log(category);
  };

  $scope.editCategory = function(category) {
    console.log(category);
  };

  $scope.newRule = function(category) {
    $scope.showNewRuleModal = true;
  };
}

module.exports.controller = ['$scope', controller];

