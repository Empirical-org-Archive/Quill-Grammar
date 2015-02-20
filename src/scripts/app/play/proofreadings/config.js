'use strict';

module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('play-pf', {
    parent: 'app',
    templateUrl: 'proofreadings.play.html',
    controller: 'ProofreadingPlayCtrl',
    url: '/play/pf/:id'
  });
};
