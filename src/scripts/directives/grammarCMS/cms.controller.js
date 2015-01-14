'use-strict';



function cmsController($scope, cs, rs) {

  /*
   * $scope initializers
   */
  cs.getCategories().then(function(categories) {
    $scope.categories = categories;
  });

  $scope.saveCategory = function(category) {
    return cs.saveCategory(category).then(function() {
      console.log('Saved', category);
      category.title = '';
    });
  };

  $scope.toggleCategoryModal = function() {
    $scope.showNewCategoryModal = true;
  };

}

module.exports = ['$scope', 'CategoryService', 'RuleService', cmsController];
