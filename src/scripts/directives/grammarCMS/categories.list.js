'use strict';

function categoriesList() {
  return {
    restrict: 'E',
    templateUrl: 'categories.list.html',
    controller: 'GrammarCMSCtrl'
  };
}

module.exports = categoriesList;
