'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.cms.grammarActivities.directives', [
  'dynform',
  require('../../../../services/lms/topicCategory.js').name,
  require('../../../../services/lms/concept.js').name,
  require('../../../../services/lms/standard.js').name,
  require('../../../../services/lms/standard_level.js').name,
])
.controller('GrammarActivityFormCtrl', require('./grammarActivityForm.controller.js'))
.directive('grammarActivityForm', require('./grammarActivityForm.directive.js'))
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
})
;
