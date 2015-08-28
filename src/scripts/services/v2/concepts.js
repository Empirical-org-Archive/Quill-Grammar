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
  function conceptQuestions(id) {
    return $firebaseArray(new Firebase(firebaseUrl + '/concepts/' + id + '/questions'));
  }

  this.get = function () {
    return ref().$loaded();
  };

  this.getById = function (id) {
    return ref().$loaded().then(function (concepts) {
      return concepts.$getRecord(id);
    });
  };

  this.add = function (record) {
    return ref().$add(record);
  };

  this.update = function (record) {
    return ref().$loaded().then(function (concepts) {
      var index = concepts.$indexFor(record.$id);
      concepts[index] = record;
      return concepts.$save(index);
    });
  };

  this.addQuestionToConcept = function (concept, conceptQuestion) {
    return conceptQuestions(concept.$id).$add(conceptQuestion);
  };

  this.getQuestionForConcept = function (concept, conceptQuestionId) {
    return conceptQuestions(concept.$id).$loaded().then(function (q) {
      return q.$getRecord(conceptQuestionId);
    });
  };

  this.modifyQuestionForConcept = function (concept, conceptQuestion) {
    return conceptQuestions(concept.$id).$loaded().then(function (qs) {
      var index = qs.$indexFor(conceptQuestion.$id);
      qs[index] = conceptQuestion;
      return qs.$save(index);
    });
  };

  return this;
});
