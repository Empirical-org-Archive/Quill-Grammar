'use strict';
module.exports = /*@ngInject*/

function configure ($stateProvider) {
  $stateProvider
    .state('cms', {
      parent: 'app',
      url: '/cms',
      templateUrl: 'cms.base.html',
      controller: 'cms',
      abstract: true,
      data: {
        //authenticateUser: true
      }
    })
    .state('cms-list', {
      parent: 'app',
      url: '/cms',
      templateUrl: 'cms.html',
      controller: 'cms',
      data: {
        //authenticateUser: true
      }
    });
};
