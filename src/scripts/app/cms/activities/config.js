'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-activities', {
    parent: 'cms',
    templateUrl: 'activities.cms.html',
    contoller: 'ActivitiesCmsCtrl',
    url: '/activities'
  });
};
