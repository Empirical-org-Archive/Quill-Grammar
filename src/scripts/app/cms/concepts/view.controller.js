'use strict';
/* globals confirm */

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

  $scope.confirmDelete = function (id) {
    var d = confirm('Are you absolutely sure you want to delete concept: ' + id + '?');
    if (d) {
      ConceptsFBService.deleteById(id).then(function () {
        $state.go('cms-concepts');
      }, function (err) {
        throw err;
      });
    }
  };
};
