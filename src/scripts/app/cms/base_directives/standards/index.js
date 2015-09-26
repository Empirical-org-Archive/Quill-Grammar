'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.cms.baseDirectives.Standards', [
  'underscore',
  require('./../../../../services/lms/standard_level.js').name,
  require('./../../../../services/lms/standard.js').name,
])
.controller('StandardsDirectiveController', require('./standards.ctrl.js'))
.directive('standardsSelector', function () {
  return {
    restrict: 'E',
    templateUrl: 'baseStandards.html',
    controller: 'StandardsDirectiveController',
    scope: {
      model: '='
    }
  };
});
