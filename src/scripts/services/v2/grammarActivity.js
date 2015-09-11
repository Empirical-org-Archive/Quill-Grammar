/*jshint newcap: false */
'use strict';

module.exports =
angular.module('quill-grammar.services.firebase.grammarActivity', [
  'firebase',
  'underscore',
  require('./../../../../.tmp/config.js').name,
  require('./../rule.js').name,
  require('./../localStorage.js').name,
  require('./question.js').name,
])
/*@ngInject*/
.factory('GrammarActivity', function (firebaseUrl, $firebaseObject, _, RuleService, $q, Question, SentenceLocalStorage, ConceptsFBService) {
  function GrammarActivity(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }
  GrammarActivity.ref = new Firebase(firebaseUrl + '/v2/grammarActivities');

  GrammarActivity.DEFAULT_QUESTION_QUANTITY = 3;

  // 'Class' methods

  GrammarActivity.getById = function (id) {
    return $firebaseObject(GrammarActivity.ref.child(id)).$loaded().then(function (data) {
      return new GrammarActivity(data);
    }).then(loadQuestionsForFirebaseActivity);
  };

  /*
   * Create a grammar activity from a custom set of rule IDs and a passage ID.
   *
   * This should only be used during play session, not for
   * creating activities to save to firebase.
   *
   * Returns a promise to match the API of GrammarActivity.getById().
   */
  GrammarActivity.fromPassageResults = function (ruleNumbers, passageId) {
    return ConceptsFBService.getByRuleNumbers(ruleNumbers).then(function (concepts) {
      var activity = new GrammarActivity({
        passageId: passageId,
        concepts: concepts
      });
      var quantities = _.times(concepts.length, function () {return GrammarActivity.DEFAULT_QUESTION_QUANTITY; });
      activity.questions = loadQuestionsFromConcepts(concepts, quantities);
      return activity;
    }, function onError (err) {
      console.error('Error loading concepts from Firebase', err);
    });
  };

  function loadQuestionsForFirebaseActivity(activity) {
    var quantities = _.pluck(activity.concepts, 'quantity');
    var conceptIds = _.keys(activity.concepts);
    return ConceptsFBService.getByIds(conceptIds).then(function (concepts) {
      activity.concepts = concepts;
      return loadQuestionsFromConcepts(concepts, quantities);
    }).then(function (questions) {
      activity.questions = questions;
      return activity;
    });
  }

  /*
   * Return a list of questions to use in the play session.
   *
   * 1st arg is an array of concepts that have already been loaded
   * from Firebase.
   * 2nd arg is a array of integers where each entry corresponds
   * to the number of questions to return for the corresponding concept
   * in the first list.
   *
   * Returns a list of questions.
   */
  function loadQuestionsFromConcepts(concepts, quantities) {
    var questionsData = _.chain(concepts)
      .map(function (concept, i) {
        _.each(concept.questions, function (question) {
          question.conceptUid = concept.concept_level_0.uid;
          question.conceptIndex = i; // For lookup in getConceptForQuestion()
        });
        return concept.questions;
      })
      .map(function (questionSets, i) {
        return _.sample(questionSets, quantities[i]);
      })
      .flatten()
      .value();

    var questionModels = _.map(questionsData, function (questionData) {
      return new Question(questionData);
    });

    return questionModels;
  }

  GrammarActivity.prototype.getConceptForQuestion = function (question) {
    return this.concepts[question.conceptIndex];
  };

  GrammarActivity.prototype.submitAnswer = function (question) {
    // If the activity was generated from passage results.
    if (this.passageId) {
      var correct = question.answerIsCorrect();
      SentenceLocalStorage.storeTempResult(this.passageId, question, question.response, correct);
    }
  };

  return GrammarActivity;
});
