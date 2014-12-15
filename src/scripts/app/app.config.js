'use strict';

module.exports = /*@ngInject*/
  function configure ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/welcome/');

    $locationProvider.html5Mode({
      enabled: true
    });
  };
