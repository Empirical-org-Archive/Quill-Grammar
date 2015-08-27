'use strict';

module.exports =

/*@ngInject*/
function ConceptsCmsCtrl (
  $scope, ConceptsFBService
) {
  ConceptsFBService.get().then(function (c) {
    $scope.concepts = c;
  });
};
