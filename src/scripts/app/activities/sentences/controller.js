'use strict';

module.exports =

/*@ngInject*/
function sentences(
  $scope, CategoryService, $state, RuleService,
  SentenceWritingService, _, $timeout
) {
  $scope.newSentence = {};
  $scope.flags = [{$id:1, title: 'Production'}, {$id:2, title:'Beta'}];

  CategoryService.getCategories().then(function(cats) {
    $scope.availableCategories = cats;
  });

  $scope.nextStep = function() {
    var ruleIds = $scope.newSentence.category.rules;
    RuleService.getRules(ruleIds).then(function(rules) {
      $scope.availableRules = rules;
      $state.go('^.questions');
    });
  };

  $scope.addRule = function(r) {
    try {
      if (!$scope.newSentence.rules) {
        $scope.newSentence.rules = [];
      }
      if (_.find($scope.newSentence.rules, r)) {
        throw new Error('Cannot have two instances of the same rule ' + r.title);
      } else if (r) {
        $scope.newSentence.rules.push(r);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  $scope.removeRule = function(r) {
    if ($scope.newSentence.rules) {
      $scope.newSentence.rules = _.without($scope.newSentence.rules, r);
    }
  };

  $scope.submitNewSentence = function(s) {
    try {
      var allPositiveQuantities = _.every(s.rules, function(r) {
        return Number(r.quantity) > 0;
      });

      if (!allPositiveQuantities) {
        throw new Error('Please make all rules have a quanity greater than zero');
      }
      SentenceWritingService.saveSentenceWriting(s).then(function(ref) {
        console.log('saved %s', ref);
      }, function(e) {
        setError(e.message);
      });
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
