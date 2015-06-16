'use strict';

module.exports =
/*@ngInject*/
function proofreadings ($scope, ProofreadingService) {
  ProofreadingService.getAllProofreadings().then(function (prfs) {
    $scope.proofreadings = prfs;
  });
};
