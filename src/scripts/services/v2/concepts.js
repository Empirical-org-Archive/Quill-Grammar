'use strict';

module.exports =
/*@ngInject*/
angular.module('quill-grammar.services.firebase.concepts', [
  'firebase',
  require('./../../../../.tmp/config.js').name,
])

.factory('ConceptsFBService', function (firebaseUrl, $firebaseArray) {
  function ref() {
    return $firebaseArray(new Firebase(firebaseUrl + '/concepts'));
  }
  this.get = function () {
    return ref().$loaded();
  };
  return this;
});
