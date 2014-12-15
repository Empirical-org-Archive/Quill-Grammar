'use strict';

module.exports = /*@ngInject*/
  function configure ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: true
    });
  };
