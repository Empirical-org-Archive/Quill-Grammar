'use strict';
module.exports = /*@ngInject*/

function configure ($stateProvider) {
  $stateProvider
    .state('cms', {
      parent: 'app',
      url: '/cms',
      templateUrl: 'cms.html',
      controller: 'cms',
      data: {
        //authenticateUser: true
      }
    });
};
