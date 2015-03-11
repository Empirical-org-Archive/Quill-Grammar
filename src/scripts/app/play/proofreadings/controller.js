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

  $scope.UNSOLVED_ERROR = 'UNSOLVED_ERROR';
  $scope.INTRODUCED_ERROR = 'INTRODUCED_ERROR';
  $scope.SOLVED_PROBLEM = 'SOLVED_PROBLEM';

  $scope.hasIntroducedError = function(word) {
    return word.type === $scope.INTRODUCED_ERROR;
  };

  $scope.hasUnsolvedError = function(word) {
    return word.type === $scope.UNSOLVED_ERROR;
  };

  $scope.hasSolvedProblem = function(word) {
    return word.type === $scope.SOLVED_PROBLEM;
  };

  $scope.groupNameBy = function(key) {
    if (key === $scope.UNSOLVED_ERROR) {
      return  'Unsolved Problem(s)';
    } else if (key === $scope.INTRODUCED_ERROR) {
      return 'Introduced Problem(s)';
    } else if (key === $scope.SOLVED_PROBLEM) {
      return 'Solved Problems(s)';
    }
  };

  $scope.submitPassage = function() {
    var passage = $scope.pf.passage;
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
    var results = [];
    _.each(passage, function(p, i) {
      if (!isValid(p)) {
        results.push({index: i, passageEntry: p, type: getErrorType(p)});
      }
      if (isValid(p) && _.has(p, 'minus')) {
        results.push({index: i, passageEntry: p, type: $scope.SOLVED_PROBLEM});
      }
    });
    if (results.length > 1) {
      showResults(results);
    } else {
      showNext();
    }
  };

  /*
   * Convience html methods
   */

  $scope.needsUnderlining = function(p) {
    if ($scope.pf && $scope.pf.underlineErrorsInProofreader && _.has(p, 'minus')) {
      return true;
    }
  };

  $scope.isBr = function(text) {
    return ProofreadingService.htmlMatches(text) !== null;
  };

  function showResults(passageResults) {
    _.each(passageResults, function(pr) {
      $scope.pf.passage[pr.index].type = pr.type;
    });
    $scope.results = passageResults;
    var ruleNumbers = _.chain(passageResults)
      .pluck('passageEntry')
      .reject(function(r) {
        return r.type !== $scope.UNSOLVED_ERROR;
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

  /*
   * Below handles setting the state, if the lesson
   * was completed without error.
   */

  function showNext() {

  }
};
