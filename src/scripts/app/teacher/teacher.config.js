'use strict';
module.exports = /*@ngInject*/

function configure ($stateProvider) {
  $stateProvider
    .state('teacher', {
      parent: 'app',
      url: '/teacher',
      templateUrl: 'teacher.html',
      controller: 'teacher as teach',
    });
};
