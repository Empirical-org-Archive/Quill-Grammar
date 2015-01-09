'use strict';

module.exports =
angular.module('quill-grammar.services.category', [
])

.factory('CategoryService', function($http, $q) {
  this.saveCategory = function(category) {
    var d = $q.defer();
    return d.promise;
  };
  return this;
});
