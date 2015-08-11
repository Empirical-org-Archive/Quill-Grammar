'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-activities', {
    parent: 'cms-activities-base',
    templateUrl: 'activities.cms.html',
    contoller: 'ActivitiesCmsCtrl',
    url: '/activities'
  })
  .state('cms-activities-base', {
    parent: 'cms',
    templateUrl: 'activities.cms.base.html',
    controller: 'ActivitiesCmsCtrl',
    abstract: true,
    url: '/activities'
  });
};
