'use strict';

module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider.state('sentences', {
    parent: 'activities',
    url: '/sentences',
    templateUrl: 'sentences.html'
  });
};
