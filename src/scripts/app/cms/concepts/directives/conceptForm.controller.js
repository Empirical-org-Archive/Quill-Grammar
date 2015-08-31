'use strict';

module.exports =

  /*
   * This directive expects concept and processConceptForm
   * to be set in scope.
   */

/*@ngInject*/
function ConceptsFormCtrl (
  $scope, _, ConceptService, StandardService,
  StandardLevelService
) {
  if (_.isUndefined($scope.concept) || !_.isObject($scope.concept)) {
    throw new Error('Please define concept object in controller scope');
  }

  if (_.isUndefined($scope.processConceptForm) || !_.isFunction($scope.processConceptForm)) {
    throw new Error('Please define processConceptForm function in controller scope');
  }

  $scope.conceptTemplate = require('../models/concept.js');

  ConceptService.get().then(function (concepts) {
    $scope.concepts = concepts;
  });

  StandardService.get().then(function (standards) {
    $scope.standards = standards;
  });

  StandardLevelService.get().then(function (standardLevels) {
    $scope.standard_levels = standardLevels;
  });
};
