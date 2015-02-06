'use strict';

module.exports =

/*@ngInject*/
function sentences(
  $scope, CategoryService, $state, RuleService,
  SentenceWritingService, _, $timeout
) {
  $scope.newSentence = {};
  $scope.flags = [{$id:1, title: 'Production'}, {$id:2, title:'Beta'}];

  SentenceWritingService.getAllSentenceWritings().then(function(ss) {
    $scope.sentences = ss;
  });

  CategoryService.getCategories().then(function(cats) {
    $scope.availableCategories = cats;
  });

  RuleService.getAllRules().then(function(rules) {
    $scope.availableRules = rules;
  });

  $scope.nextStep = function() {
    $state.go('^.questions');
  };

  $scope.addRule = function(s, r) {
    try {
      if (!s.rules) {
        s.rules = [];
      }
      if (_.find(s.rules, r)) {
        throw new Error('Cannot have two instances of the same rule ' + r.title);
      } else if (r) {
        s.rules.push(r);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  $scope.removeRule = function(s, r) {
    if (s) {
      s.rules = _.without(s.rules, r);
    }
  };

  $scope.submitSentence = function(stateString, s, edit) {
    function handleResult() {
      $scope.newSentence = {};
      $state.go(stateString);
    }
    function handlerError(e) {
      console.error(e);
      setError(e.message || e);
    }
    try {
      var allPositiveQuantities = _.every(s.rules, function(r) {
        return Number(r.quantity) > 0;
      });

      if (!allPositiveQuantities) {
        throw new Error('Please make all rules have a quanity greater than zero');
      }

      var p = null;
      if (edit) {
        p = SentenceWritingService.updateSentenceWriting(s);
      } else {
        p = SentenceWritingService.saveSentenceWriting(s);
      }

      return p.then(handleResult, handlerError);
    } catch (e) {
      setError(e.message);
    }
  };


  function clearError() {
    $scope.error = null;
  }

  function setError(msg) {
    $scope.error = msg;
    $timeout(clearError, 5000);
  }

};
