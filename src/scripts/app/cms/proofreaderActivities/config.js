'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-proofreader-activities-base', {
    parent: 'cms-activities-base',
    templateUrl: 'proofreader.activities.base.cms.html',
    controller: 'ProofreaderActivitiesCmsCtrl',
    abstract: true,
    url: '/proofreaderActivities'
  })
  .state('cms-proofreader-activities', {
    parent: 'cms-proofreader-activities-base',
    templateUrl: 'proofreader.activities.cms.html',
    controller: 'ProofreaderActivitiesCmsCtrl',
    url: ''
  })
  .state('cms-proofreader-activities-create', {
    parent: 'cms-proofreader-activities-base',
    templateUrl: 'proofreader.activities.create.cms.html',
    controller: 'ProofreaderActivitiesCreateCmsCtrl',
    url: '/create'
  })
  .state('cms-proofreader-activities-edit', {
    parent: 'cms-proofreader-activities-base',
    templateUrl: 'proofreader.activities.edit.cms.html',
    controller: 'ProofreaderActivitiesEditCmsCtrl',
    url: '/:id'
  });
};
