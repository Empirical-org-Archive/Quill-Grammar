'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.cms.baseDirectives.Concept', [
  'underscore',
  require('./../../../../services/v2/concepts.js').name,
  require('./../../../../services/lms/concept.js').name,
])
.controller('ConceptsDirectiveController', require('./concepts.ctrl.js'))
.directive('conceptsSelector', function () {
  return {
    restrict: 'E',
    templateUrl: 'baseConcepts.html',
    controller: 'ConceptsDirectiveController',
    scope: {
      model: '=',
      levels: '='
    }
  };
})
.filter('filterConcepts', function (_) {
  return function (concepts, parentId) {
    return _.where(concepts, {parent_id: parentId});
  };
})
.filter('filterFBConcepts', function (_) {
  return function (concepts, parentId) {
    return _.reject(concepts, function (c) {
      if (!c.concept_level_0) {
        return false;
      } else {
        return c.concept_level_0.parent_id !== parentId;
      }
    });
  };
});
