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
    pf.replace(/{\+(\S+)-(\S+)\|(\S+)}/g, function(key, plus, minus, ruleNumber) {
      $scope.passageQuestions[key] = {
        plus: plus,
        minus: minus,
        ruleNumber: ruleNumber
      };
    });
    _.each($scope.passageQuestions, function(pq, key) {
      pf = pf.replace(key, '<span id="' + $scope.obscure(key) + '">' + pq.minus + '</span>');
    });
    return pf;
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
};
