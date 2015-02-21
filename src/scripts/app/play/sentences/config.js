'use strict';

module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('play-sw', {
    parent: 'app',
    templateUrl: 'sentences.play.html',
    controller: 'SentencePlayCtrl',
    url: '/play/sw/:id'
  })
  .state('play-sw-gen', {
    parent: 'app',
    templateUrl: 'sentences.play.html',
    controller: 'SentencePlayCtrl',
    url: '/play/sw/g/:ids'
  });
};
