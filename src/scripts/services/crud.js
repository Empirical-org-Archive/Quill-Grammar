'use strict';

module.exports =
angular.module('quill-grammar.services.crud', [
  'firebase'
])

.factory('CrudService', function($firebase, $q) {
  function crud(entity) {
  };

  return crud;
});
