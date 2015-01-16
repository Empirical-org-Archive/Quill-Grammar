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

function controller($scope, cs, rs, $q) {
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
    var d = $q.defer();
    rs.saveRule(rule).then(function(ruleId) {
      category.rules[ruleId] = true;
      cs.updateCategory(category).then(d.resolve,d.reject);
    }, d.reject);
    return d.promise;
  };
}

module.exports.controller = ['$scope', 'CategoryService', 'RuleService', '$q', controller];

