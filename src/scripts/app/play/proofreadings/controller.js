'use strict';

module.exports =

/*@ngInject*/
function ProofreadingPlayCtrl(
  $scope, $state, ProofreadingService, RuleService, _
) {
  $scope.id = $state.params.id;

  function error(e) {
    $state.go('index');
  }

  /* Returns null or an array of matches */
  //TODO Only looking for line break tags right now
  function htmlMatches(text) {
    if (!text) {
      return null;
    }
    return text.match(/<\s*br\s*?\/>/g);
  }

  function prepareProofreading(pf) {
    $scope.passageQuestions = {};
    pf.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, function(key, plus, minus, ruleNumber) {
      $scope.passageQuestions[key] = {
        plus: plus,
        minus: minus,
        ruleNumber: ruleNumber
      };
      pf = pf.replace(key, minus.split(/\s/).join('|'));
    });
    var prepared = _.chain(pf.split(/\s/))
      .filter(function removeNullWords(n) {
        return n !== '';
      })
      .map(function parseHtmlTokens(w) {
        var matches = htmlMatches(w);
        if (matches) {
          _.each(matches, function(match) {
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
      .map(function parseHangingPfQuestionsWithNoSpace(w) {
        _.each($scope.passageQuestions, function(v, key) {
          if (w !== key && w.indexOf(key) !== -1) {
            w = w.split(key).join(' ' + key).split(/\s/);
          }
        });
        return w;
      })
      .flatten()
      .map(function(w) {
        w = w.replace(/\|/g, ' ');
        var passageQuestion = _.findWhere($scope.passageQuestions, {minus: w});
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
      .map(function trim(w) {
        w.text = w.text.trim();
        w.responseText = w.responseText.trim();
        return w;
      })
      .filter(function removeSpaces(w) {
        return w.text !== '';
      })
      .value();

    return prepared;

  }

  $scope.obscure = function(key) {
    return btoa(key);
  };

  $scope.ubObscure = function(o) {
    return atob(o);
  };

  ProofreadingService.getProofreading($scope.id).then(function(pf) {
    pf.passage = prepareProofreading(pf.passage);
    $scope.pf = pf;
  }, error);

  $scope.UNSOLVED_ERROR = 'UNSOLVED_ERROR';
  $scope.INTRODUCED_ERROR = 'INTRODUCED_ERROR';

  $scope.hasIntroducedError = function(word) {
    return word.errorType === $scope.INTRODUCED_ERROR;
  };

  $scope.hasUnsolvedError = function(word) {
    return word.errorType === $scope.UNSOLVED_ERROR;
  };

  $scope.submitPassage = function(passage) {
    $scope.submitted = true;
    function isValid(passageEntry) {
      if (_.has(passageEntry, 'minus')) {
        //A grammar entry
        return passageEntry.responseText === passageEntry.plus;
      } else {
        //A regular word
        return passageEntry.text === passageEntry.responseText;
      }
    }
    function getErrorType(passageEntry) {
      return _.has(passageEntry, 'minus') ? $scope.UNSOLVED_ERROR : $scope.INTRODUCED_ERROR;
    }
    var errors = [];
    _.each(passage, function(p, i) {
      if (!isValid(p)) {
        errors.push({index: i, passageEntry: p, errorType: getErrorType(p)});
      }
    });
    if (errors.length > 1) {
      showErrors(errors);
    } else {
      showNext();
    }
  };

  $scope.isBr = function(text) {
    return htmlMatches(text) !== null;
  };

  function showErrors(passageErrors) {
    _.each(passageErrors, function(pe) {
      $scope.pf.passage[pe.index].errorType = pe.errorType;
    });
  }

  function showNext() {

  }
};
