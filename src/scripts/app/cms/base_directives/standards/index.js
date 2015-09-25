'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.cms.baseDirectives.Standards', [
  'underscore',
])
.controller('StandardsDirectiveController', require('./standards.ctrl.js'))
.directive('standardsSelector', function() {
  return {
    restrict: 'E',
    templateUrl: 'baseStandards.html',
    controller: 'StandardsDirectiveController',
    scope: {
      model: '='
    }
  };
});
