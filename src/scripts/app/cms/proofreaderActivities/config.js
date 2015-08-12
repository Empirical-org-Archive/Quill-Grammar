'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-proofreader-activities', {
    parent: 'cms-activities-base',
    templateUrl: 'proofreader.activities.cms.html',
    contoller: 'ProofreaderActivitiesCmsCtrl',
    url: '/proofreaderActivities'
  });
};
