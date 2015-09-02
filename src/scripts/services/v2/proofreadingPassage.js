'use strict';

module.exports =
angular.module('quill-grammar.services.proofreadingPassage', [
  'underscore',
])
/*@ngInject*/
.factory('ProofreadingPassage', function (_, uuid4, PassageWord, RuleService) {
  function ProofreadingPassage(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }

  // TODO: Copied from old ProofreadingService, clean this up.
  ProofreadingPassage.htmlMatches = function (text) {
    /* Returns null or an array of matches */
    //TODO Only looking for line break tags right now
    if (!text) {
      return null;
    }
    return text.match(/<\s*br\s*?\/>/g);
  };

  ProofreadingPassage.fromPassageString = function (passage) {
    var proofreadingPassage = new ProofreadingPassage({
      passage: passage
    });

    extractQuestionsFromPassage(proofreadingPassage);
    var passage = proofreadingPassage.passage;
    var questions = proofreadingPassage.questions;

    function parseHangingPassageQuestionsWithNoSpace(w) {
      _.each(questions, function (v, key) {
        if (w !== key && w.indexOf(key) !== -1) {
          w = w.split(key).join(' ' + key).split(/\s/);
        }
      });
      return w;
    }

    function splitPassageIntoWords(w) {
      var passageQuestion = questions[w];
      if (passageQuestion) {
        var c = _.clone(passageQuestion);
        c.text = c.minus;
        c.responseText = c.text;
        return new PassageWord(c);
      } else {
        return new PassageWord({
          text: w,
          responseText: w
        });
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

    var words = _.chain(passage.split(/\s/))
      .filter(removeNullWords)
      .map(parseHtmlTokens)
      .flatten()
      .map(parseHangingPassageQuestionsWithNoSpace)
      .flatten()
      .map(splitPassageIntoWords)
      .map(trimSpecialObjects)
      .filter(removeLeftoverSpaces)
      .value();

    proofreadingPassage.words = words;
    proofreadingPassage.questions = questions;
    return proofreadingPassage;
  };

  // 'Instance' methods

  ProofreadingPassage.prototype.getNumErrors = function () {
    return _.keys(this.questions).length;
  };

  ProofreadingPassage.prototype.getRules = function () {
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
    self.questions = questions;
  }

  function removeNullWords(n) {
    return n !== '';
  }

  function parseHtmlTokens(w) {
    var matches = ProofreadingPassage.htmlMatches(w);
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

  return ProofreadingPassage;
});
