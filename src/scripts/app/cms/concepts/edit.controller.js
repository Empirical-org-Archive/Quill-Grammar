'use strict';

module.exports =

/*@ngInject*/
function ConceptsEditCmsCtrl (
  $scope, $state, ConceptsFBService
) {
  if ($state.params.id === null || $state.params.id === '') {
    $state.go('cms-concepts');
    return;
  }

  $scope.concept = {};

  ConceptsFBService.getById($state.params.id).then(function (c) {
    $scope.concept = c;
  });

  $scope.processConceptForm = function () {
    ConceptsFBService.update($scope.concept).then(function () {
      $state.go('cms-concepts-view', {id: $state.params.id});
      return;
    }, function (error) {
      console.error(error);
    });
  };
};
