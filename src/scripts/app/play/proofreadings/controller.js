'use strict';

module.exports =

/*@ngInject*/
function ProofreadingPlayCtrl(
  $scope, $state, ProofreadingService, RuleService, _
) {
  $scope.id = $state.params.id;

  function error(e) {
    console.error(e);
    $state.go('index');
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
          console.log(c);
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
      .value();

    prepared = _.chain(prepared)
      .zip(_.map(_.range(prepared.length), function() {
        return {
          text: ' ',
          responseText: ' '
        };
      }))
      .flatten()
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
    console.log(pf.passage);
    $scope.pf = pf;
  }, error);

  $scope.submitPassage = function(passage) {
    function isValid(passageEntry) {
      if (_.has(passageEntry, 'minus')) {
        //A grammar entry
        return passageEntry.responseText === passageEntry.plus;
      } else {
        //A regular word
        return passageEntry.text === passageEntry.responseText;
      }
    }
    var errors = [];
    _.each(passage, function(p) {
      if (!isValid(p)) {
        errors.push(p);
      }
    });
    if (errors.length > 1) {
      showErrors(errors);
    } else {
      showNext();
    }
  };

  function showErrors(errors) {
    $scope.errors = errors;
  }

  function showNext() {

  }
};
