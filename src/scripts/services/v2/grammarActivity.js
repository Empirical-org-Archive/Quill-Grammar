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
.factory('GrammarActivity', function (firebaseUrl, $firebaseObject, _, RuleService, $q, Question, SentenceLocalStorage) {
  function GrammarActivity(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }
  GrammarActivity.ref = new Firebase(firebaseUrl + '/activities/sentenceWritings');

  GrammarActivity.DEFAULT_QUESTION_QUANTITY = 3;

  // 'Class' methods

  GrammarActivity.getById = function (id) {
    return $firebaseObject(GrammarActivity.ref.child(id)).$loaded().then(function (data) {
      return new GrammarActivity(data);
    });
  };

  /*
   * Create a grammar activity from a custom set of rule IDs and a passage ID.
   *
   * This should only be used during play session, not for
   * creating activities to save to firebase.
   *
   * Returns a promise to match the API of GrammarActivity.getById().
   */
  GrammarActivity.fromPassageResults = function (ruleIds, passageId) {
    return new $q(function (resolve) {
      var activity = new GrammarActivity({
        passageId: passageId,
        rules: _.map(ruleIds, function (ruleId) {
          return {
            quantity: GrammarActivity.DEFAULT_QUESTION_QUANTITY,
            ruleId: ruleId
          };
        })
      });
      resolve(activity);
    });
  };

  // Retrieve rule questions for the activity's rule numbers and in the right quantities.
  // TODO: This will need to change to support the new data structure outlined in #148.
  GrammarActivity.prototype.getQuestions = function () {
    var ruleIds = _.pluck(this.rules, 'ruleId');
    var quantities = _.pluck(this.rules, 'quantity');
    var self = this;
    return RuleService.getRules(ruleIds).then(function (rules) {
      // Ported directly from SentencePlayCtrl.
      self.rulesWithSelectedQuestions = _.chain(rules)
        .map(function (rr, i) {
          rr.selectedRuleQuestions = _.chain(rr.resolvedRuleQuestions)
            .sample(quantities[i])
            .map(function (rrq) {
              rrq.ruleIndex = i;
              return rrq;
            })
            .map(function (rrq) {
              return new Question(rrq);
            })
            .value();
          return rr;
        })
        .value();
      self.selectedQuestions = _.chain(self.rulesWithSelectedQuestions)
        .pluck('selectedRuleQuestions')
        .flatten()
        .value();

      return self.selectedQuestions;
    });
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
