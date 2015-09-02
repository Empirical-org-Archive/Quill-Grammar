'use strict';

module.exports = function () {
  return {
    restrict: 'E',
    templateUrl: 'error-tooltip.html',
    controller: require('./controller.js')
  };
};
