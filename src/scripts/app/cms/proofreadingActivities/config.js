'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-proofreading-activities', {
    parent: 'cms-activities-base',
    templateUrl: 'proofreading.activities.cms.html',
    contoller: 'ProofreadingActivitiesCmsCtrl',
    url: '/proofreadingActivities'
  });
};
