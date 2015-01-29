'use strict';

module.exports =

/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
    .state('activities', {
      parent: 'app',
      url: '/activities',
      templateUrl: 'activities.html'
    });
};
