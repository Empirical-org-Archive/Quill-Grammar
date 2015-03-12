'use strict';

module.exports =

/*@ngInject*/
function ProofreadingPlayCtrl(
  $scope, $state, ProofreadingService, RuleService, _
) {
  $scope.id = $state.params.uid;

  //If brainpop is truthy, we setup some scope state
  //that the template will react to. The template
  //adds the brainpop script and assigns an id to the div
  if ($state.params.brainpop) {
    $scope.brainpop = 'BrainPOPsnapArea';
  }

  function error(e) {
    $state.go('index');
  }

  $scope.obscure = function(key) {
    return btoa(key);
  };

  $scope.ubObscure = function(o) {
    return atob(o);
  };

  ProofreadingService.getProofreading($scope.id).then(function(pf) {
    pf.passage = ProofreadingService.prepareProofreading(pf.passage, $scope);
    $scope.pf = pf;
    fetchListedRules();
  }, error);

  /*
   * Functions for interacting with the referenced rules in the
   * passage questions.
   */

  function fetchListedRules() {
    var ruleIds = _.pluck($scope.passageQuestions, 'ruleNumber');
    RuleService.getRules(ruleIds).then(function(rules) {
      $scope.referencedRules = rules;
    });
  }

  $scope.getRuleInfoBy = function(ruleNumber) {
    return _.findWhere($scope.referencedRules, {ruleNumber: Number(ruleNumber)}).title;
  };

  /*
   * These functions below handle submission errors
   * and state/$scope updates after the student has submitted
   * their passage.
   */

  $scope.INCORRECT_ERROR = 'Incorrect';
  $scope.NOT_NECESSARY_ERROR = 'Not Necessary';
  $scope.CORRECT = 'Correct';

  $scope.hasNotNecessaryError = function(word) {
    return word.type === $scope.NOT_NECESSARY_ERROR;
  };

  $scope.hasIncorrectError = function(word) {
    return word.type === $scope.INCORRECT_ERROR;
  };

  $scope.hasCorrect = function(word) {
    return word.type === $scope.CORRECT;
  };

  $scope.submitPassage = function() {
    var passage = $scope.pf.passage;
    function isValid(passageEntry) {
      if (_.has(passageEntry, 'minus')) {
        console.log(passageEntry);
        //A grammar entry
        return passageEntry.responseText === passageEntry.plus;
      } else {
        //A regular word
        return passageEntry.text === passageEntry.responseText;
      }
    }
    function getErrorType(passageEntry) {
      return _.has(passageEntry, 'minus') ? $scope.INCORRECT_ERROR : $scope.NOT_NECESSARY_ERROR;
    }
    var results = [];
    _.each(passage, function(p, i) {
      if (!isValid(p)) {
        results.push({index: i, passageEntry: p, type: getErrorType(p)});
      }
      if (isValid(p) && _.has(p, 'minus')) {
        results.push({index: i, passageEntry: p, type: $scope.CORRECT});
      }
    });
    var numErrorsToSolve = 1;//_.keys($scope.passageQuestions).length / 2;
    var numErrorsFound = _.where(results, {type: $scope.CORRECT}).length;
    if (numErrorsFound < numErrorsToSolve) {
      showModalNotEnoughFound();
    } else {
      showResultsModal(results, numErrorsFound, numErrorsToSolve);
    }
  };

  /*
   * Modal settings
   */
  function showModalNotEnoughFound() {
    $scope.pf.modal = {
      title: 'Keep Trying!',
      message: 'You need to find at least 50% of the errors.',
      buttonMessage: 'Find Errors',
      buttonClick: function() {
        $scope.pf.modal.show = false;
      },
      show: true
    };
  }

  function showResultsModal(results, numErrorsFound, numErrorsToSolve) {
    var title = numErrorsFound === numErrorsToSolve ? 'Congratulations!' : 'Good Work!';
    var nf = numErrorsFound === numErrorsToSolve ? 'all ' + String(numErrorsFound) : String(numErrorsFound) + ' of ' + String(numErrorsToSolve);
    $scope.pf.modal = {
      title: title,
      message: 'You found ' + nf + ' errors',
      buttonMessage: 'Review Your Work',
      buttonClick: function() {
        $scope.pf.modal.show = false;
        showResults(results);
      },
      show: true
    };
  }

  /*
   * Convenience html methods
   */

  $scope.answerImageName = function(t) {
    return _.map(t.split(' '), function(s) {
      return s.toLowerCase();
    }).join('_');
  };

  $scope.needsUnderlining = function(p) {
    if ($scope.pf && $scope.pf.underlineErrorsInProofreader && _.has(p, 'minus')) {
      return true;
    }
  };

  $scope.isBr = function(text) {
    return ProofreadingService.htmlMatches(text) !== null;
  };

  $scope.hasErrorToShow = function(word) {
    return _.any([$scope.hasNotNecessaryError, $scope.hasCorrect, $scope.hasIncorrectError], function(fn) {
      return fn(word);
    });
  };

  function showResults(passageResults) {
    _.each(passageResults, function(pr) {
      $scope.pf.passage[pr.index].type = pr.type;
    });
    $scope.results = passageResults;
    var ruleNumbers = _.chain(passageResults)
      .pluck('passageEntry')
      .reject(function(r) {
        return r.type !== $scope.INCORRECT_ERROR;
      })
      .pluck('ruleNumber')
      .reject(_.isUndefined)
      .uniq()
      .value();
    generateLesson(ruleNumbers);
    captureReady();
  }

  /*
   * Below when handle building the lesson and showing
   * the appropriate ui.
   */

  function generateLesson(ruleNumbers) {
    $scope.goToLesson = function() {
      $state.go('play-sw-gen', {
        ids: ruleNumbers
      });
    };
    $scope.hasLesson = true;
  }

};
