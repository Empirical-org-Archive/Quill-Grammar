'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-grammar-activities', {
    parent: 'cms-activities-base',
    templateUrl: 'grammar.activities.cms.html',
    contoller: 'GrammarActivitiesCmsCtrl',
    url: '/grammarActivities'
  });
};
