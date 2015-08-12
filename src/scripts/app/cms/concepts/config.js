'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-concepts', {
    parent: 'cms-concepts-base',
    templateUrl: 'concepts.cms.html',
    contoller: 'ConceptsCmsCtrl',
    url: '?/'
  })
  .state('cms-concepts-base', {
    parent: 'cms',
    templateUrl: 'concepts.cms.base.html',
    contoller: 'ConceptsCmsCtrl',
    url: '/concepts',
    abstract: true
  });
};
