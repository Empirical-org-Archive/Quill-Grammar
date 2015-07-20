'use strict';
module.exports = /*@ngInject*/

function configure ($stateProvider) {
  $stateProvider
    .state('index', {
      parent: 'app',
      url: '/',
      templateUrl: 'index.html',
      controller: 'index as ind',
    })
    ;
};
