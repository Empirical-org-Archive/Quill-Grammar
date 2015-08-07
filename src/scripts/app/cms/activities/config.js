'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-activities-practice-questions', {
    parent: 'cms',
    templateUrl: 'activities.cms.html',
    contoller: 'ActivitiesCmsCtrl',
    url: '/activities'
  });
};
