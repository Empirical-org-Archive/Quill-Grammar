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

  function prepareProofReading(pf) {
    pf.replace(/{\+(\w+)-(\w+)\|(\w+)}/g, function(key, plus, minus, ruleNumber) {
    });
    return pf;
  }

  ProofreadingService.getProofreading($scope.id).then(function(pf) {
    pf.passage = prepareProofReading(pf.passage);
    $scope.pf = pf;
  }, error);
};
