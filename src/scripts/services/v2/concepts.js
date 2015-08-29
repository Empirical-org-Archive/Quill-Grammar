'use strict';

module.exports =
angular.module('quill-grammar.services.firebase.concepts', [
  'firebase',
  'underscore',
  require('./../../../../.tmp/config.js').name,
])
/*@ngInject*/
.factory('ConceptsFBService', function (firebaseUrl, $firebaseArray, _) {
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
    return ref().$loaded().then(function (concepts) {
      var maxRule = _.max(concepts, function (c) {
        return c.ruleNumber;
      });
      if (_.isNumber(maxRule.ruleNumber)) {
        record.ruleNumber = maxRule.ruleNumber + 1;
      } else {
        record.ruleNumber = 0;
      }
      return concepts.$add(record);
    });
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
