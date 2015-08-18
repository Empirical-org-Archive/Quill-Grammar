'use strict';

module.exports =
angular.module('quill-grammar.services.index', [
  require('./crud.js').name,
])

.factory('IndexService', function (firebaseUrl, $firebaseObject) {
  function index(indexName) {
    if (firebaseUrl[firebaseUrl.length - 1] !== '/') {
      firebaseUrl = firebaseUrl + '/';
    }
    firebaseUrl = firebaseUrl + 'indices/';
    if (!indexName || indexName === '') {
      throw new Error('Firebase indexName MUST be defined');
    }

    function getEntries() {
      return $firebaseObject(new Firebase(firebaseUrl + indexName));
    }
    function getEntry(e) {
      return $firebaseObject(new Firebase(firebaseUrl + indexName + '/' + e));
    }

    function addElementToEntry(entry, element) {
      return getEntry(entry).$loaded().then(function (list) {
        list[element] = true;
        return list.$save();
      });
    }

    function removeElementFromEntry(entry, element) {
      return getEntry(entry).$loaded().then(function (list) {
        delete(list[element]);
        return list.$save();
      });
    }

    function removeEntry(entry) {
      return getEntries().$loaded().then(function (entries) {
        entries[entry] = null;
        return entries.$save();
      });
    }

    function lookUpElementsForEntry(entry) {
      return getEntry(entry);
    }

    return {
      addElementToEntry: addElementToEntry,
      removeElementFromEntry: removeElementFromEntry,
      removeEntry: removeEntry,
      lookUpElementsForEntry: lookUpElementsForEntry,
    };
  }

  return index;
});
