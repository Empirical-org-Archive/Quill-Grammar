'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-error-reports', {
    parent: 'cms',
    templateUrl: 'errorReports.index.cms.html',
    controller: 'ErrorReportsCmsCtrl',
    url: '/error-reports'
  })
  .state('cms-error-view', {
    parent: 'cms-error-reports',
    templateUrl: 'errorReports.view.cms.html',
    controller: 'ErrorReportsViewCmsCtrl',
    url: '/:id'
  });
};
