'use strict';

module.exports =

/*@ngInject*/
function ConceptsCreateCmsCtrl (
  $scope, ConceptsFBService, $state
) {
  $scope.concept = {};

  $scope.processConceptForm = function () {
    ConceptsFBService.add($scope.concept).then(function () {
      $state.go('cms-concepts');
      return;
    }, function (error) {
      console.error(error);
    });
  };
};
