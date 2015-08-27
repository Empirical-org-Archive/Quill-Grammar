'use strict';

module.exports =

/*@ngInject*/
function ConceptsViewCmsCtrl (
  $scope, $state, ConceptsFBService
) {
  if ($state.params.id === null || $state.params.id === '') {
    $state.go('cms-concepts');
    return;
  }

  ConceptsFBService.getById($state.params.id).then(function (c) {
    $scope.concept = c;
  });
};
