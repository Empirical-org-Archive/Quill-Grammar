'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-concepts', {
    parent: 'cms',
    templateUrl: 'concepts.cms.html',
    contoller: 'ConceptsCmsCtrl',
    url: '/concepts'
  });
};
