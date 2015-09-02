'use strict';

module.exports =
angular.module('quill-grammar.services.proofreadingPassage', [
  'underscore',
])
/*@ngInject*/
.factory('ProofreadingPassage', function (_, uuid4, PassageWord, RuleService, $analytics) {
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

  /*
   * Convert a string of text from Firebase into a ProofreadingPassage object.
   */
  ProofreadingPassage.fromPassageString = function (passage) {
    var proofreadingPassage = new ProofreadingPassage({
      passage: passage,
      numChanges: 0,
      madeChange: false
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

  ProofreadingPassage.prototype.getNumErrorsToSolve = function () {
    return Math.floor(this.getNumErrors() / 2);
  }

  ProofreadingPassage.prototype.getNumCorrect = function () {
    return _.where(this.results, {type: PassageWord.CORRECT}).length;
  }

  ProofreadingPassage.prototype.getRules = function () {
    var ruleIds = _.pluck(this.questions, 'ruleNumber');
    return RuleService.getRules(ruleIds);
  };

  ProofreadingPassage.prototype.submit = function () {
    var results = [];
    _.each(this.words, function (word, i) {
      if (!word.isValid()) {
        results.push({index: i, passageEntry: word, type: word.getErrorType()});
      }
      if (word.isValid() && _.has(word, 'minus')) {
        results.push({index: i, passageEntry: word, type: PassageWord.CORRECT});
      }
    });
    this.results = results;
    var numErrors = this.getNumErrors();
    var numErrorsToSolve = this.getNumErrorsToSolve();
    var numErrorsFound = this.getNumCorrect();
    var numEdits = this.numChanges;
    var isFinished = numErrorsFound >= numErrorsToSolve ||  numEdits >= numErrorsToSolve;
    return isFinished;
  };

  ProofreadingPassage.prototype.onInputChange = function (word) {
    var nc = this.numChanges;
    if (word.responseText === '') {
      if (!word.countedChange) {
        nc++;
        word.countedChange = true;
      }
    } else if (word.responseText !== word.text) {
      if (!word.countedChange) {
        nc++;
      }
      word.countedChange = true;
    } else if (word.responseText === word.text && word.countedChange) {
      nc = Math.max(nc - 1, 0);
      word.countedChange = false;
    }
    this.numChanges = nc;
    if (!this.madeChange && nc > 0) {
      this.madeChange = true;
      $analytics.eventTrack('Edit One Passage Word', word);
    }
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
