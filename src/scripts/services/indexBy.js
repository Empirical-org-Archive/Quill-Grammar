'use strict';

module.exports =
angular.module('quill-grammar.services.index', [
  require('./crud.js').name,
])

.factory('IndexService', function(firebaseUrl, $firebase) {
  function index(indexName) {
    if (firebaseUrl[firebaseUrl.length - 1] !== '/') {
      firebaseUrl = firebaseUrl + '/';
    }
    firebaseUrl = firebaseUrl + 'indices/';
    if (!indexName || indexName === '') {
      throw new Error('Firebase indexName MUST be defined');
    }

    function getEntries() {
      return $firebase(new Firebase(firebaseUrl + indexName)).$asObject();
    }
    function getEntry(e) {
      return $firebase(new Firebase(firebaseUrl + indexName + '/' + e)).$asArray();
    }

    function addElementToEntry(entry, element) {
      return getEntry(entry).$loaded().then(function(list) {
        return list.$add(element);
      });
    }

    function removeElementFromEntry(entry, element) {
      return getEntry(entry).$loaded().then(function(list) {
        return list.$remove(element);
      });
    }

    function removeEntry(entry) {
      return getEntries().$loaded().then(function(entries) {
        return entries.$remove(entry);
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
