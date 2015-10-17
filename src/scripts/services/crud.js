'use strict';

module.exports =
angular.module('quill-grammar.services.crud', [
  'firebase',
  'underscore',
  require('../../../.tmp/config').name
])

.factory('CrudService', function (firebaseUrl, $firebaseObject, $firebaseArray, $q, _) {
  function crud(entity, properties, prefix) {
    if (!entity || entity === '') {
      throw new Error('Firebase Entity MUST be defined');
    }
    if (!properties) {
      throw new Error('Please define the properties for your entity ' + entity);
    }
    if (firebaseUrl[firebaseUrl.length - 1] !== '/') {
      firebaseUrl = firebaseUrl + '/';
    }
    var baseUrl = String(firebaseUrl);
    if (prefix) {
      baseUrl = baseUrl + prefix + '/';
    }
    var baseRoute = baseUrl + entity;
    var baseRef = new Firebase(baseRoute);
    var baseCollection = $firebaseObject(baseRef);

    function getRef() {
      return baseRef;
    }

    function sanitize(item) {
      if (properties && _.isObject(item)) {
        return _.pick(item, function (value, key) {
          return key[0] === '$' || _.contains(properties, key);
        });
      }
      return item;
    }

    function isValid(item) {
      if (_.has(item, '$value')) {
        return !_.isUndefined(item.$value) && item.$value !== null;
      } else {
        return true;
      }
    }

    function save(item) {
      var d = $q.defer();
      var entityItem = sanitize(item);
      baseRef.$push(entityItem).then(function (ref) {
        d.resolve(ref.key());
      }, function (error) {
        d.reject(error);
      });
      return d.promise;
    }

    function del(item) {
      var d = $q.defer();
      if (!item || !item.$id) {
        throw new Error('Item doesn\'t have an $id property');
      }
      baseRef.$remove(item.$id).then(function (ref) {
        d.resolve(ref.key());
      }, function (error) {
        d.reject(error);
      });

      return d.promise;
    }

    function all() {
      var d = $q.defer();
      var a = $firebaseArray(baseRef);
      a.$loaded().then(function () {
        d.resolve(a);
      }, function (error) {
        d.reject(error);
      });
      return d.promise;
    }

    function get(entityId) {
      var d = $q.defer();
      var refUrl = baseRoute + '/' + entityId;
      var entityRef = new Firebase(refUrl);
      var entity = $firebaseObject(entityRef);
      entity.$loaded().then(function (entityData) {
        if (isValid(entityData)) {
          d.resolve(entityData);
        } else {
          console.error('There was an error loading the entity at: ', refUrl, entityData);
          d.reject(new Error('Entity did not meet the properties requirement'));
        }
      }, function (error) {
        d.reject(error);
      });
      return d.promise;
    }

    function update(item) {
      var d = $q.defer();
      baseCollection.$loaded().then(function () {
        var index = item.$id;
        baseCollection[index] = sanitize(item);
        baseCollection.$save(index).then(function (ref) {
          console.log(ref.key());
          d.resolve(ref.key());
        }, function (error) {
          console.log(error);
          d.reject(error);
        });
      });
      return d.promise;
    }

    function saveWithCustomId(item) {
      if (!item.$id) {
        throw new Error('No id provided');
      }
      var id = String(item.$id);
      delete(item.$id);
      item = sanitize(item);
      var fb = new Firebase(baseRoute + '/' + id);
      return fb.set(item);
    }

    return {
      save: save,
      saveWithCustomId: saveWithCustomId,
      del: del,
      all: all,
      get: get,
      update: update,
      getRef: getRef,
    };
  }

  return crud;
});
