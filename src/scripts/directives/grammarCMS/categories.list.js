'use strict';

function categoriesList() {
  return {
    restrict: 'E',
    templateUrl: 'categories.list.html',
    controller: 'GrammarCmsCtrl'
  };
}

module.exports = categoriesList;
