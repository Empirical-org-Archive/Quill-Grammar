'use strict';

/* Usage:
 *
 * ProofreaderActivity.get(id).then(function (proofreaderActivity) {
 *  return proofreaderActivity.getRules();
 * }).then(function (rules) {
 *  // do something here
 * });
 *
 */

module.exports =
angular.module('quill-grammar.services.firebase.proofreaderActivity', [
  'firebase',
  'underscore',
  require('./../../../../.tmp/config.js').name,
])
/*@ngInject*/
.factory('ProofreaderActivity', function (firebaseUrl, $firebaseObject, _, uuid4, RuleService) {
  function ProofreaderModel(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }
  ProofreaderModel.ref = new Firebase(firebaseUrl + '/activities/passageProofreadings');

  // 'Class' methods

  ProofreaderModel.getById = function (id) {
    return $firebaseObject(ProofreaderModel.ref.child(id)).$loaded().then(function (data) {
      return new ProofreaderModel(data);
    });
  };

  // 'Instance' methods

  ProofreaderModel.prototype.preparePassage = function () {
    var questions = extractQuestionsFromPassage(this); // WARNING: side-effect-y
    var passage = this.passage;

    function parseHangingPassageQuestionsWithNoSpace(w) {
      _.each(questions, function (v, key) {
        if (w !== key && w.indexOf(key) !== -1) {
          w = w.split(key).join(' ' + key).split(/\s/);
        }
      });
      return w;
    }

    function splitPassageIntoObjects(w) {
      var passageQuestion = questions[w];
      if (passageQuestion) {
        var c = _.clone(passageQuestion);
        c.text = c.minus;
        c.responseText = c.text;
        return c;
      } else {
        return {
          text: w,
          responseText: w
        };
      }
    }

    function trimSpecialObjects(w) {
      w.text = w.text.trim();
      w.responseText = w.responseText.trim();
      return w;
    }

    function removeLeftoverSpaces(w) {
      return w.text !== '';
    }

    var prepared = _.chain(passage.split(/\s/))
      .filter(removeNullWords)
      .map(parseHtmlTokens)
      .flatten()
      .map(parseHangingPassageQuestionsWithNoSpace)
      .flatten()
      .map(splitPassageIntoObjects)
      .map(trimSpecialObjects)
      .filter(removeLeftoverSpaces)
      .value();

    this.passage = prepared; // FIXME: Converting from a string -> array of objects = bad!
    this.questions = questions;
    return questions;
  };

  ProofreaderModel.prototype.getRules = function () {
    var ruleIds = _.pluck(this.questions, 'ruleNumber');
    return RuleService.getRules(ruleIds);
  };

  // 'private' methods

  function extractQuestionsFromPassage(self) {
    var questions = {};
    var passage = self.passage;

    passage.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, function (key, plus, minus, ruleNumber) {
      var genKey = uuid4.generate();
      questions[genKey] = {
        plus: plus,
        minus: minus,
        ruleNumber: ruleNumber
      };
      passage = passage.replace(key, genKey);
    });
    passage.replace(/{-([^|]+)\+([^-]+)\|([^}]+)}/g, function (key, minus, plus, ruleNumber) {
      var genKey = uuid4.generate();
      questions[genKey] = {
        plus: plus,
        minus: minus,
        ruleNumber: ruleNumber
      };
      passage = passage.replace(key, genKey);
    });
    self.passage = passage;
    return questions;
  }

  function removeNullWords(n) {
    return n !== '';
  }

  function parseHtmlTokens(w) {
    var matches = ProofreaderModel.htmlMatches(w);
    if (matches) {
      _.each(matches, function (match) {
        if (w !== match) {
          w = w.replace(new RegExp(match, 'g'), ' ' + match + ' ');
        }
      });
      w = w.trim();
      return w.split(/\s/);
    }
    return w;
  }

  // TODO: Copied from old ProofreadingService, clean this up.
  ProofreaderModel.htmlMatches = function (text) {
    /* Returns null or an array of matches */
    //TODO Only looking for line break tags right now
    if (!text) {
      return null;
    }
    return text.match(/<\s*br\s*?\/>/g);
  };

  return ProofreaderModel;
});
