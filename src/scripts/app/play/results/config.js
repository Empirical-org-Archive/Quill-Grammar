'use strict';

module.exports =

/*@ngInject*/
function ($stateProvider) {
  $stateProvider
  .state('play-internal-results', {
    parent: 'app',
    templateUrl: 'internal.results.html',
    controller: 'InternalResultsCtrl',
    url: '/play/results'
  });
};
