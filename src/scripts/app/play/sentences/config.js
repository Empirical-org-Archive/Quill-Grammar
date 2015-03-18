'use strict';

module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('play-sw', {
    parent: 'app',
    templateUrl: 'sentences.play.html',
    controller: 'SentencePlayCtrl',
    url: '/play/sw?uid&student'
  })
  .state('play-sw.results', {
    parent: 'app',
    templateUrl: 'sentences.results.html',
    controller: 'ResultsController',
    url: '/play/sw/results?uid&student'
  })
  .state('play-sw-gen.results', {
    parent: 'app',
    templateUrl: 'sentences.results.html',
    controller: 'ResultsController',
    url: '/play/sw/results?internal'
  })
  .state('play-sw-gen', {
    parent: 'app',
    templateUrl: 'sentences.play.html',
    controller: 'SentencePlayCtrl',
    url: '/play/sw/g/:ids?student'
  });
};
