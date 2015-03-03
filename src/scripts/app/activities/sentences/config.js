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
    require: '^SentencesCtrl',
    controller: 'EditSentenceCtrl',
    templateUrl: 'sentences.edit.html'
  })
  .state('sentences.new', {
    url: '/new',
    templateUrl: 'sentences.new.html'
  })
  .state('sentences.new.details', {
    parent: 'sentences.new',
    url: '/details?uid',
    templateUrl: 'sentences.new.details.html'
  })
  .state('sentences.new.questions', {
    parent: 'sentences.new',
    url: '/questions?uid',
    templateUrl: 'sentences.new.questions.html'
  });
};
