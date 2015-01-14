'use strict';

module.exports =
angular.module('quill-grammar.services.crud', [
  'firebase'
])

.factory('CrudService', function(firebaseUrl, $firebase, $q) {
  function crud(entity) {
    if (firebaseUrl[firebaseUrl.length - 1] !== '/') {
      firebaseUrl = firebaseUrl + '/';
    }
    if (!entity || entity === '') {
      throw new Error('Firebase Entity MUST be defined');
    }
    var baseRef = new Firebase(firebaseUrl + entity);
    var baseCollection = $firebase(baseRef).$asArray();
    function save(entityItem) {
      var d = $q.defer();
      baseCollection.$loaded().then(function() {
        baseCollection.$add(entityItem).then(function(ref) {
          d.resolve(ref.key());
        }, function(error){
          d.reject(error);
        });
      });
      return d.promise;
    }

    function del(entityItem) {
      var d = $q.defer();
      baseCollection.$loaded().then(function() {
        baseCollection.$remove(entityItem).then(function(ref) {
          d.resolve(ref.key());
        }, function(error){
          d.reject(error);
        });
      });
      return d.promise;
    }

    function all() {
      var d = $q.defer();
      baseCollection.$loaded().then(function() {
        d.resolve(baseCollection);
      }, function(error) {
        d.reject(error);
      });
      return d.promise;
    }

    function get(entityId) {
      var d = $q.defer();
      baseCollection.$loaded().then(function() {
        var record = baseCollection.$getRecord(entityId);
        if (record) {
          d.resolve(record);
        } else {
          d.reject(new Error('Record with ' + entityId + ' not found.'));
        }
      });
      return d.promise;
    }

    return {
      save: save,
      del: del,
      all: all,
      get: get,
    };
  }

  return crud;
});
