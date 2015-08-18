'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-grammar-activities-base', {
    parent: 'cms-activities-base',
    templateUrl: 'grammar.activities.base.cms.html',
    controller: 'GrammarActivitiesCmsCtrl',
    abstract: true,
    url: '/grammarActivities'
  })
  .state('cms-grammar-activities', {
    parent: 'cms-grammar-activities-base',
    templateUrl: 'grammar.activities.cms.html',
    controller: 'GrammarActivitiesCmsCtrl',
    url: ''
  })
  .state('cms-grammar-activities-create', {
    parent: 'cms-grammar-activities-base',
    templateUrl: 'grammar.activities.create.cms.html',
    controller: 'GrammarActivitiesCreateCmsCtrl',
    url: '/create'
  });
};
