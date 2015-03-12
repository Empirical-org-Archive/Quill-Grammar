'use strict';

/*@ngInject*/
module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      title: '=',
      max: '=',
      current: '=',
    },
    controller: function($scope) {

    },
    templateUrl: 'progress-bar.html'
  };
};
