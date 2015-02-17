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
    });
    return _.chain(pf.split(/\s/))
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
        if ($scope.passageQuestions[w]) {
          var c = _.clone($scope.passageQuestions[w]);
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
      .value();

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
};
