'use strict';

module.exports =

/*@ngInject*/
function ProofreadingPlayCtrl (
  $scope, $state, _,
  $location, $document, $timeout,
  ProofreaderActivity,
  PassageWord,
  ProofreadingPassage
) {
  $scope.id = $state.params.uid;

  $scope.obscure = function (key) {
    return btoa(key);
  };

  $scope.ubObscure = function (o) {
    return atob(o);
  };

  ProofreaderActivity.getById($scope.id).then(function (activity) {
    var proofreadingPassage = ProofreadingPassage.fromPassageString(activity.passage);
    $scope.proofreadingPassage = proofreadingPassage;
    $scope.proofreadingActivity = activity;
    return proofreadingPassage.getRules();
  });

  /*
   * Modal settings
   */
  function showModalNotEnoughFound() {
    var needed = $scope.proofreadingPassage.getNumErrorsToSolve();
    $scope.modal = {
      title: 'Keep Trying!',
      message: 'You must make at least ' + needed + ' edits.',
      buttonMessage: 'Find Edits',
      buttonClick: function () {
        $scope.modal.show = false;
      },
      show: true
    };
  }

  /*
   * Below when handle building the lesson and showing
   * the appropriate ui.
   */

  function generateLesson(ruleNumbers) {
    $scope.goToLesson = function () {
      $state.go('play-sw-gen', {
        ids: ruleNumbers,
        passageId: $scope.id,
        student: $state.params.student
      });
    };
    $scope.hasLesson = true;
  }

  function showResults() {
    var proofreadingPassage = $scope.proofreadingPassage;
    var results = $scope.proofreadingPassage.results;
    _.each(results, function (passageResult, i) {
      var word = proofreadingPassage.words[passageResult.index];
      word.type = passageResult.type;
      word.resultIndex = i;
      word.ruleNumber = passageResult.passageEntry.ruleNumber;
      word.totalResults = results.length;
      word.nextAction = $scope.nextAction(word, passageResult.index);
    });
    generateLesson(proofreadingPassage.getResultRuleNumbers());
    $scope.focusResult(0, results[0].index);
    proofreadingPassage.sendResultsAnalytics();
    // ProofreadingPassage is probably doing too much.
    proofreadingPassage.saveLocalResults($scope.id);
    proofreadingPassage.submitted = true;
  }

  function showResultsModal() {
    var numErrorsFound = $scope.proofreadingPassage.getNumCorrect();
    var numErrorsToSolve = $scope.proofreadingPassage.getNumErrorsToSolve();
    function createTitle() {
      if (numErrorsFound === numErrorsToSolve) {
        return 'Congratulations!';
      } else if (numErrorsFound >= numErrorsToSolve / 2) {
        return 'Good Work!';
      }
      return '';
    }
    var nf = numErrorsFound === numErrorsToSolve ? 'all ' + String(numErrorsFound) : String(numErrorsFound) + ' of ' + String(numErrorsToSolve);
    var title = createTitle();

    $scope.modal = {
      title: title,
      message: 'You found ' + nf + ' errors.',
      buttonMessage: 'Review Your Work',
      buttonClick: function () {
        $scope.modal.show = false;
        showResults();
      },
      show: true
    };
  }

  $scope.submitPassage = function () {
    var isFinished = $scope.proofreadingPassage.submit();
    $scope.results = $scope.proofreadingPassage.results;
    if (isFinished) {
      showResultsModal();
    } else {
      showModalNotEnoughFound();
    }
  };

  function getNumResults() {
    return _.keys($scope.results).length;
  }

  /*
   * Convenience html methods
   */

  $scope.nextAction = function (word, index) {
    if (!$scope.results) {
      return {};
    }
    var allCorrect = $scope.proofreadingPassage.getNumCorrect() === $scope.proofreadingPassage.getNumErrors();
    var na = {
      fn: null,
      title: ''
    };
    if (word.resultIndex + 1 >= getNumResults()) {
      if (allCorrect) {
        na.fn = function () {
          $state.go('play-sw-gen', {
            ids: [],
            passageId: $scope.id,
            pfAllCorrect: true,
            student: $state.params.student
          });
        };
        na.title = 'View Results';
      } else {
        na.fn = function () {
          $scope.goToLesson();
        };
        na.title = 'Start My Activity';
      }
    } else {
      na.fn = function () {
        $scope.focusResult(word.resultIndex + 1, index);
      };
      na.title = 'Next Edit';
    }

    return na;
  };
  var getAbsPosition = function (el) {
    var el2 = el;
    var curtop = 0;
    var curleft = 0;
    if (document.getElementById || document.all) {
      do {
        curleft += el.offsetLeft - el.scrollLeft;
        curtop += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
        el2 = el2.parentNode;
        while (el2 !== el) {
          curleft -= el2.scrollLeft;
          curtop -= el2.scrollTop;
          el2 = el2.parentNode;
        }
      } while (el.offsetParent);
    } else if (document.layers) {
      curtop += el.y;
      curleft += el.x;
    }
    return [curtop, curleft];
  };

  function calculateTop(sIndex) {
    var breakIndexes = _.chain($scope.proofreadingPassage.words)
      .map(function (word, index) {
        return [index, word.isBr()];
      })
      .filter(function (v) {
        return v[1];
      })
      .map(function (v) {
        return v[0];
      })
      .sortBy(function (num) {
        return num;
      })
      .value();
    var indexWithOutGoingOver = _.find(breakIndexes, function (i) {
      return i >= sIndex;
    });
    var scrollId = 'last-chance-tooltip-breakpoint-at-panel';
    if (indexWithOutGoingOver) {
      scrollId = 'break-binding-point-' + String(indexWithOutGoingOver);
    }
    var elem = document.getElementById(scrollId);
    var top = getAbsPosition(elem)[0];
    return String(top) + 'px';
  }

  $scope.focusResult = function (resultIndex, scrollIndex) {
    var p = $scope.results[resultIndex - 1];
    var r = $scope.results[resultIndex];
    if (p) {
      $scope.proofreadingPassage.words[p.index].tooltip = {};
    }

    if (r) {
      $scope.proofreadingPassage.words[r.index].tooltip = {
        style: {
          visibility: 'visible',
          opacity: 1,
          top: calculateTop(r.index)
        }
      };
    }
    var scrollTo = r.index;
    if (!scrollTo) {
      scrollTo = scrollIndex;
    }
    if (String(scrollTo)) {
      var scrollId = 'error-tooltip-scroll-' + String(scrollTo);
      var elem = angular.element(document.getElementById(scrollId));
      $document.scrollToElement(elem);
    }
  };

  // FIXME: I don't think this ever worked, because p (passage word) never has a 'minus' field.
  // Only passage results have the 'minus' field.
  // At any rate, this should move to PassageWord#needsUnderlining() at some point.
  $scope.needsUnderlining = function (p) {
    if ($scope.pf && $scope.pf.underlineErrorsInProofreader && _.has(p, 'minus')) {
      return true;
    }
  };
};
