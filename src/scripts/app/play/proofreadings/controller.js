'use strict';

module.exports =

/*@ngInject*/
function ProofreadingPlayCtrl (
  $scope, $state, RuleService, _,
  $location, localStorageService, $document, $timeout,
  ProofreaderActivity,
  PassageWord,
  ProofreadingPassage,
  $analytics
) {
  $scope.id = $state.params.uid;

  $scope.obscure = function (key) {
    return btoa(key);
  };

  $scope.ubObscure = function (o) {
    return atob(o);
  };

  ProofreaderActivity.getById($scope.id).then(function (activity) {
    // TODO: This should be a presentation model that we can't save
    console.log('activity', activity);
    var proofreadingPassage = ProofreadingPassage.fromPassageString(activity.passage);

    $scope.proofreadingPassage = proofreadingPassage;

    // FIXME: These scope assignments are currently here for backwards-compatibility.
    $scope.passageQuestions = proofreadingPassage.questions;
    $scope.pf = activity;
    $scope.pf.passage = proofreadingPassage.words;

    console.log('passage questions', $scope.passageQuestions);
    return proofreadingPassage.getRules();
  }).then(function (rules) {
    console.log('rules', rules);
    $scope.referencedRules = rules;
  });

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
   * Modal settings
   */
  function showModalNotEnoughFound() {
    var needed = $scope.proofreadingPassage.getNumErrorsToSolve();
    $scope.pf.modal = {
      title: 'Keep Trying!',
      message: 'You must make at least ' + needed + ' edits.',
      buttonMessage: 'Find Edits',
      buttonClick: function () {
        $scope.pf.modal.show = false;
      },
      show: true
    };
  }

  function showResultsModal() {
    var results = $scope.results;
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

    $scope.pf.modal = {
      title: title,
      message: 'You found ' + nf + ' errors.',
      buttonMessage: 'Review Your Work',
      buttonClick: function () {
        $scope.pf.modal.show = false;
        showResults(results);
      },
      show: true
    };
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
    var breakIndexes = _.chain($scope.pf.passage)
      .map(function (word, index) {
        return [index, $scope.isBr(word.responseText)];
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
      $scope.pf.passage[p.index].tooltip = {};
    }

    if (r) {
      $scope.pf.passage[r.index].tooltip = {
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

  $scope.getErrorTooltipClass = function (index) {
    var results = $scope.$parent.results;
    var d = {'error-tooltip-reverse': true};
    if (false) {
      var ri = _.indexOf(_.pluck(results, 'index'), index);
      var sp = 3;
      d = {
        'error-tooltip': ri > sp,
        'error-tooltip-reverse': ri <= sp
      };
    }
    return d;
  };

  $scope.getErrorTooltipTopClass = function (type) {
    var obj = {'top-panel': true};
    obj[type] = true;
    return obj;
  };

  $scope.answerImageName = function (t) {
    if (!t) {
      return;
    }
    return _.map(t.split(' '), function (s) {
      return s.toLowerCase();
    }).join('_');
  };

  $scope.needsUnderlining = function (p) {
    if ($scope.pf && $scope.pf.underlineErrorsInProofreader && _.has(p, 'minus')) {
      return true;
    }
  };

  $scope.isBr = function (text) {
    return ProofreadingPassage.htmlMatches(text) !== null;
  };

  function showResults(passageResults) {
    _.each(passageResults, function (pr, i) {
      $scope.pf.passage[pr.index].type = pr.type;
      $scope.pf.passage[pr.index].resultIndex = i;
      $scope.pf.passage[pr.index].ruleNumber = pr.passageEntry.ruleNumber;
      $scope.pf.passage[pr.index].totalResults = passageResults.length;
      $scope.pf.passage[pr.index].nextAction = $scope.nextAction($scope.pf.passage[pr.index], pr.index);
    });
    var ruleNumbers = _.chain(passageResults)
      .pluck('passageEntry')
      .reject(function (r) {
        return r.type !== PassageWord.INCORRECT_ERROR;
      })
      .pluck('ruleNumber')
      .reject(_.isUndefined)
      .uniq()
      .value();
    generateLesson(ruleNumbers);
    $scope.focusResult(0, passageResults[0].index);
    // TODO: -> ProofreadingPassage model
    sendResultsAnalytics(passageResults);
    // TODO: -> ProofreadingPassage model
    saveResults(getLocalResults(passageResults));
    $scope.pf.passage.submitted = true;
  }

  function saveResults(r) {
    localStorageService.set('pf-' + $scope.id, r);
    localStorageService.remove('sw-' + $scope.id);
    localStorageService.remove('sw-temp-' + $scope.id);
  }

  /*
   * Mapping results for analytics
   */
  // TODO: -> ProofreadingPassage model
  function sendResultsAnalytics(results) {
    var event = 'Press Check Answer';
    var passageResults = _.chain(results)
      .pluck('passageEntry')
      .map(function pick (p) {
        return _.pick(p, ['minus', 'ruleNumber', 'responseText', 'plus', 'type']);
      })
      .value();
    var correct = _.filter(passageResults, function (pr) {
      return pr.type === PassageWord.CORRECT;
    });
    var incorrect = _.filter(passageResults, function (pr) {
      return pr.type !== PassageWord.CORRECT;
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
      score: Number(correct.length / results.length) * 100
    };
    $analytics.eventTrack(event, attrs);
  }

  /*
   * generate passage results for local results
   */

  function getLocalResults(passageResults) {
    var rules = $scope.referencedRules;
    return _.chain(passageResults)
      .pluck('passageEntry')
      .reject(function (pe) {
        return _.isUndefined(pe.ruleNumber);
      })
      .map(function (pe) {
        var rule = _.findWhere(rules, {ruleNumber: Number(pe.ruleNumber)});
        return {
          title: rule.title,
          correct: pe.type === PassageWord.CORRECT
        };
      })
      .groupBy('title')
      .map(function (entries, title) {
        return {
          conceptClass: title,
          total: entries.length,
          correct: _.filter(entries, function (v) { return v.correct; }).length
        };
      })
      .value();
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
};
