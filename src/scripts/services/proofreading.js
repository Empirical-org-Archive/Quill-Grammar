'use strict';

module.exports =
angular.module('quill-grammar.services.proofreading', [
  require('./crud.js').name,
])

.factory('ProofreadingService', function (CrudService, _, uuid4) {
  var crud = new CrudService('passageProofreadings', [
    'flagId', 'categoryId', 'instructions', 'passage', 'title', 'description'
  ], 'activities');

  var ps = this;

  this.saveProofreading = function (proofreading) {
    return crud.save(proofreading);
  };
  this.deleteProofreading = function (proofreading) {
    return crud.del(proofreading);
  };
  this.getProofreading = function (proofreadingId) {
    return crud.get(proofreadingId);
  };
  this.getAllProofreadings = function () {
    return crud.all();
  };

  this.htmlMatches = function (text) {
    /* Returns null or an array of matches */
    //TODO Only looking for line break tags right now
    if (!text) {
      return null;
    }
    return text.match(/<\s*br\s*?\/>/g);
  };

  this.prepareProofreading = function (pf, $scope) {
    $scope.passageQuestions = {};
    pf.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, function (key, plus, minus, ruleNumber) {
      var genKey = uuid4.generate();
      $scope.passageQuestions[genKey] = {
        plus: plus,
        minus: minus,
        ruleNumber: ruleNumber
      };
      pf = pf.replace(key, genKey);
    });
    pf.replace(/{-([^|]+)\+([^-]+)\|([^}]+)}/g, function (key, minus, plus, ruleNumber) {
      var genKey = uuid4.generate();
      $scope.passageQuestions[genKey] = {
        plus: plus,
        minus: minus,
        ruleNumber: ruleNumber
      };
      pf = pf.replace(key, genKey);
    });
    var prepared = _.chain(pf.split(/\s/))
      .filter(function removeNullWords (n) {
        return n !== '';
      })
      .map(function parseHtmlTokens (w) {
        var matches = ps.htmlMatches(w);
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
      })
      .flatten()
      .map(function parseHangingPfQuestionsWithNoSpace (w) {
        _.each($scope.passageQuestions, function (v, key) {
          if (w !== key && w.indexOf(key) !== -1) {
            w = w.split(key).join(' ' + key).split(/\s/);
          }
        });
        return w;
      })
      .flatten()
      .map(function (w) {
        var passageQuestion = $scope.passageQuestions[w];
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
      })
      .map(function trim (w) {
        w.text = w.text.trim();
        w.responseText = w.responseText.trim();
        return w;
      })
      .filter(function removeSpaces (w) {
        return w.text !== '';
      })
      .value();

    return prepared;
  };
  return this;
});
