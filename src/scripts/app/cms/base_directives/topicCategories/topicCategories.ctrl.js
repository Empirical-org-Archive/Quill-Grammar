'use strict';

/*@ngInject*/
module.exports =

function TopicCategoriesDirectiveCtrl (
  $scope, TopicCategoryService
) {
  TopicCategoryService.get().then(function (tc) {
    $scope.topicCategories = tc;
  });
};
