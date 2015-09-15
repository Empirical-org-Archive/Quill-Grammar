'use strict';

module.exports =
angular.module('quill-grammar.services.proofreadingPassage', [
  'underscore',
  require('./../rule.js').name,
  require('./passageWord.js').name,
  'uuid4',
  'angulartics'
])
/*@ngInject*/
.factory('ProofreadingPassage', function (_, uuid4, PassageWord, RuleService, $analytics, localStorageService, ConceptsFBService) {
  function ProofreadingPassage(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }

  // 'private' methods

  function extractQuestionsFromPassage(passage) {
    var questions = {};

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
    return [questions, passage];
  }

  function removeNullWords(n) {
    return n !== '';
  }

  function parseHtmlTokens(w) {
    var matches = PassageWord.htmlMatches(w);
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

  /*
   * Convert a string of text from Firebase into a ProofreadingPassage object.
   */
  ProofreadingPassage.fromPassageString = function (passage) {
    var proofreadingPassage = new ProofreadingPassage({
      numChanges: 0,
      madeChange: false
    });

    var retVal = extractQuestionsFromPassage(passage);
    var questions = retVal[0];
    var convertedPassageText = retVal[1];

    function parseHangingPassageQuestionsWithNoSpace(w) {
      _.each(questions, function (v, key) {
        if (w !== key && w.indexOf(key) !== -1) {
          w = w.split(key).join(' ' + key).split(/\s/);
        }
      });
      return w;
    }

    function splitPassageIntoWords(w) {
      if (_.has(questions, w)) {
        var c = _.clone(questions[w]);
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

    var words = _.chain(convertedPassageText.split(/\s/))
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
    return loadConcepts(proofreadingPassage).then(function (concepts) {
      proofreadingPassage.concepts = concepts;
      return proofreadingPassage;
    });
  };

  function loadConcepts(proofreadingPassage) {
    var ruleNumbers = _.chain(proofreadingPassage.questions)
                        .pluck('ruleNumber')
                        .map(parseInt)
                        .value();
    return ConceptsFBService.getByRuleNumbers(ruleNumbers);
  }

  // 'Instance' methods

  ProofreadingPassage.prototype.getNumErrors = function () {
    return _.keys(this.questions).length;
  };

  ProofreadingPassage.prototype.getNumErrorsToSolve = function () {
    return Math.floor(this.getNumErrors() / 2);
  };

  ProofreadingPassage.prototype.getNumCorrect = function () {
    return _.where(this.results, {type: PassageWord.CORRECT}).length;
  };

  ProofreadingPassage.prototype.getResultRuleNumbers = function () {
    var ruleNumbers = _.chain(this.results)
      .pluck('passageEntry')
      .reject(function (r) {
        return r.type !== PassageWord.INCORRECT_ERROR;
      })
      .pluck('ruleNumber')
      .reject(_.isUndefined)
      .uniq()
      .value();
    return ruleNumbers;
  };

  /*
   * Save proofreading results to LocalStorage.
   *
   * Is there any reason not to save these to Firebase?
   */
  ProofreadingPassage.prototype.saveLocalResults = function (id) {
    var results = this.results;
    var concepts = this.concepts;

    function saveResults(r) {
      localStorageService.set('pf-' + id, r);
      localStorageService.remove('sw-' + id);
      localStorageService.remove('sw-temp-' + id);
    }

    /*
     * generate passage results for local results
     */
    function getLocalResults() {
      return _.chain(results)
        .pluck('passageEntry')
        .reject(function (pe) {
          return _.isUndefined(pe.ruleNumber);
        })
        .map(function (pe) {
          var concept = _.findWhere(concepts, {ruleNumber: Number(pe.ruleNumber)});
          if (!concept) {
            throw new Error('Could not find concept corresponding to rule number: ' + pe.ruleNumber);
          }
          return {
            title: concept.concept_level_0.name,
            correct: pe.type === PassageWord.CORRECT
          };
        })
        .groupBy('title')
        .map(function (entries, title) {
          return {
            concept: title,
            total: entries.length,
            correct: _.filter(entries, function (v) { return v.correct; }).length
          };
        })
        .value();
    }

    saveResults(getLocalResults());
  };

  /*
   * Mapping results for analytics
   */
  // TODO: -> ProofreadingPassage model
  ProofreadingPassage.prototype.sendResultsAnalytics = function () {
    var event = 'Press Check Answer';
    var passageResults = _.chain(this.results)
      .pluck('passageEntry')
      .map(function pick (p) {
        return _.pick(p, ['minus', 'ruleNumber', 'responseText', 'plus', 'type']);
      })
      .value();
    var correct = _.filter(passageResults, function (passageResult) {
      return passageResult.type === PassageWord.CORRECT;
    });
    var incorrect = _.filter(passageResults, function (passageResult) {
      return passageResult.type !== PassageWord.CORRECT;
    });

    var correctWords = _.map(correct, function (c) {
      return c.responseText;
    });

    var incorrectWords = _.map(incorrect, function (i) {
      return i.responseText;
    });

    var correctRuleNumbers = _.map(correct, function (c) {
      return c.ruleNumber;
    });

    var incorrectRuleNumbers = _.map(incorrect, function (i) {
      return i.ruleNumber;
    });

    var attrs = {
      correct: correct,
      incorrect: incorrect,
      correctWords: correctWords,
      correctRuleNumbers: correctRuleNumbers,
      incorrectRuleNumbers: incorrectRuleNumbers,
      incorrectWords: incorrectWords,
      score: Number(correct.length / this.results.length) * 100
    };
    $analytics.eventTrack(event, attrs);
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

  /*
   * Function to return the grammatical concept for a word
   * With v1, we are just using the rule title. In the future
   * we will make a data model change.
   */
  ProofreadingPassage.prototype.getGrammaticalConcept = function (word) {
    if (word.ruleNumber) {
      var concept = _.findWhere(this.concepts, {ruleNumber: Number(word.ruleNumber)});
      if (concept && concept.concept_level_0.name) {
        return concept.concept_level_0.name;
      }
    }
  };

  return ProofreadingPassage;
});
