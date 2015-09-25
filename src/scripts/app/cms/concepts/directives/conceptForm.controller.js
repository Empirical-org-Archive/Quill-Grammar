'use strict';

module.exports =

  /*
   * This directive expects concept and processConceptForm
   * to be set in scope.
   */

/*@ngInject*/
function ConceptsFormCtrl (
  $scope, _
) {
  if (_.isUndefined($scope.concept) || !_.isObject($scope.concept)) {
    throw new Error('Please define concept object in controller scope');
  }

  if (_.isUndefined($scope.processConceptForm) || !_.isFunction($scope.processConceptForm)) {
    throw new Error('Please define processConceptForm function in controller scope');
  }

  $scope.conceptTemplate = require('../models/concept.js');
};
