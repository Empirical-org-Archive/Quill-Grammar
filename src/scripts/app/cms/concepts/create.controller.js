'use strict';

module.exports =

/*@ngInject*/
function ConceptsCreateCmsCtrl (
  $scope, ConceptsFBService
) {
  $scope.concept = {};

  $scope.processConceptForm = function () {
    ConceptsFBService.add($scope.concept).then(function () {
      console.log('success');
    }, function (error) {
      console.error(error);
    });
  };
};
