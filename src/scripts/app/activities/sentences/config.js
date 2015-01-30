'use strict';

module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('sentences', {
    abstract: true,
    url: '/sentences',
    template: '<div ui-view></div>'
  })
  .state('list', {
    parent: 'sentences',
    url: '/list',
    templateUrl: 'sentences.list.html'
  })
  .state('edit', {
    parent: 'sentences',
    url: '/edit/:id',
    templateUrl: 'sentences.edit.html'
  })
  .state('new', {
    parent: 'sentences',
    url: '/new',
    templateUrl: 'sentences.new.html'
  });
};
