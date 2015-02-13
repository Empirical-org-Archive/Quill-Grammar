'use strict';

module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('proofreadings', {
    parent: 'activities',
    controller: 'ProofreadingsCtrl',
    url: '/proofreadings',
    template: '<div ui-view></div>'
  })
  .state('proofreadings.list', {
    url: '/list',
    templateUrl: 'proofreadings.list.html'
  });
};
