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
      parent: 'cms',
      url: '',
      templateUrl: 'cms.html',
      controller: 'cms',
      data: {
        //authenticateUser: true
      }
    })
    .state('cms-activities-base', {
      parent: 'cms',
      url: '',
      abstract: true,
      templateUrl: 'activities.cms.base.html'
    });
};
