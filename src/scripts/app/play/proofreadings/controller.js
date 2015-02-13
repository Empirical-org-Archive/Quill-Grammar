'use strict';

module.exports =

/*@ngInject*/
function ProofreadingPlayCtrl(
  $scope, $state, ProofreadingService, RuleService
) {
  $scope.id = $state.params.id;

  function error(e) {
    console.error(e);
    $state.go('index');
  }

  ProofreadingService.getProofreading($scope.id).then(function(pf) {
    pf = prepareProofReading(pf);
    $scope.pf = pf;
  }, error);

  function prepareProofReading(pf) {
    return pf;
  }
};
