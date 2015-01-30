'use strict';

module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('sentences', {
    parent: 'activities',
    controller: 'SentencesCtrl',
    url: '/sentences',
    template: '<div ui-view></div>'
  })
  .state('sentences.list', {
    url: '/list',
    templateUrl: 'sentences.list.html'
  })
  .state('sentences.edit', {
    url: '/edit/:id',
    templateUrl: 'sentences.edit.html'
  })
  .state('sentences.new', {
    url: '/new',
    templateUrl: 'sentences.new.html'
  });
};
