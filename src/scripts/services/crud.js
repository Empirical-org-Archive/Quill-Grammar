'use strict';

module.exports =
angular.module('quill-grammar.services.crud', [
  'firebase',
  'underscore',
])

.factory('CrudService', function(firebaseUrl, $firebase, $q, _) {
  function crud(entity, properties) {
    if (!properties) {
      properties = [];
    }
    properties.push('$id');
    properties.push('$value');
    if (firebaseUrl[firebaseUrl.length - 1] !== '/') {
      firebaseUrl = firebaseUrl + '/';
    }
    if (!entity || entity === '') {
      throw new Error('Firebase Entity MUST be defined');
    }
    var baseRef = new Firebase(firebaseUrl + entity);
    var baseCollection = $firebase(baseRef).$asArray();

    function sanitize(item) {
      if (properties) {
        return _.pick(item, properties);
      }
      return item;
    }

    function save(item) {
      var d = $q.defer();
      var entityItem = sanitize(item);
      baseCollection.$loaded().then(function() {
        baseCollection.$add(entityItem).then(function(ref) {
          d.resolve(ref.key());
        }, function(error){
          d.reject(error);
        });
      });
      return d.promise;
    }

    function del(item) {
      var entityItem = sanitize(item);
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

    function update(item) {
      return baseCollection.$save(sanitize(item));
    }

    return {
      save: save,
      del: del,
      all: all,
      get: get,
      update: update,
    };
  }

  return crud;
});
