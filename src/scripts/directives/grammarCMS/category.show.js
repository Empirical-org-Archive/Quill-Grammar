'use strict';

function categoryShow() {
  return {
    restrict: 'E',
    templateUrl: 'category.show.html',
    controller: 'GrammarCmsCtrl',
    scope: {
      category: '='
    }
  };
}

module.exports = categoryShow;
