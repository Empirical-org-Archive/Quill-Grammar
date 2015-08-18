'use strict';

module.exports =

/*@ngInject*/
function ConceptsCreateCmsCtrl(
  $scope
) {
  $scope.concept = {};

  $scope.processConceptForm = function () {
    console.log('Processing ', $scope.concept);
  };
};
