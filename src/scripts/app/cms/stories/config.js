'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-stories', {
    parent: 'cms',
    templateUrl: 'stories.cms.html',
    contoller: 'StoriesCmsCtrl',
    url: '/stories'
  });
};
