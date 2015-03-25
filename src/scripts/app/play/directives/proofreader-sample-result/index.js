'use strict';

module.exports =
/*@ngInject*/
angular.module('quill-grammar.play.directives.proofreader', [])
.directive('proofreaderSampleResult', function() {
  return {
    restrict: 'E',
    templateUrl: 'proofreader-sample-result.html',
    scope: {
      uid: '='
    },
    controller: 'ProofreadingDirCtrl'
  };
})
.controller('ProofreadingDirCtrl', function(
  $scope, localStorageService, _
) {
  var pfResults = localStorageService.get('pf-' + $scope.uid);
  var swResults = localStorageService.get('sw-' + $scope.uid);

  function getTotals(set) {
    var correct = 0;
    var total = 0;

    if (_.isArray(set)) {
      _.each(set, function(s) {
        if (!_.isNumber(s.correct) || !_.isNumber(s.total)) {
          throw new Error('incorrect object sent to getTotals iterator');
        }
        correct = correct + s.correct;
        total = total + s.total;
      });
    }

    return {
      correct: correct,
      total: total
    };
  }

  var pfTotals = getTotals(pfResults);
  var swTotals = getTotals(swResults);

  var totals = {
    correct: pfTotals.correct + swTotals.correct,
    total: pfTotals.total + swTotals.total
  };

  $scope.rankings = {
    at_proficiency: {
      title: 'At Proficiency',
      threshold: 75,
      class: 'at-proficiency',
    },
    near_proficiency: {
      title: 'Near Proficiency',
      threshold: 50,
      class: 'near-proficiency',
    },
    not_proficient: {
      title: 'Not Proficient',
      threshold: 0,
      class: 'not-proficient',
    }
  };


  function totalRanking(totals) {
    if (!_.isNumber(totals.correct) || !_.isNumber(totals.total)) {
      throw new Error('incorrect object sent to totalRanking');
    }

    if (totals.total !== 0) {
      var score = (totals.correct / totals.total) * 100;
      return _.chain($scope.rankings)
        //We'll guarantee
        .sortBy(function(r) {
          return r.threshold;
        })
        .reject(function(r) {
          return score < r.threshold;
        })
        .last()
        .value();
    } else {
      return $scope.rankings.not_proficient;
    }
  }


  if (totals.total > 0) {
    var rankObj = totalRanking(totals);
    $scope.ranking = rankObj.title;
    $scope.score = String(totals.correct) + '/' + String(totals.total);

    $scope.rankingClass = {};
    $scope.rankingClass[rankObj.class] = true;
  }

});
