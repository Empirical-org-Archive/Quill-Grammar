'use strict';

module.exports =

/*@ngInject*/
function SentencePlayCtrl (
  $scope, $state, SentenceWritingService, RuleService, _,
  ConceptResult, SentenceLocalStorage, $analytics,
  AnalyticsService, finalizeService,
  GrammarActivity
) {
  $scope.$watch('currentRuleQuestion', function (crq) {
    if (_.isObject(crq)) {
      $scope.currentRule = $scope.sentenceWriting.rulesWithSelectedQuestions[crq.ruleIndex];
    }
  });

  $scope.number = 0;
  $scope.numAttempts = 2;

  /*
   * When the underlying rule question directive fires the 'answerRuleQuestion'
   * event we catch it here. If we are a valid student, then we queue up
   * the results to send to the LMS when the activity is finished.
   *
   * If the max number of attempts are reached, we set show next question to
   * true.
   */
  $scope.$on('answerRuleQuestion', function (e, crq, answer, correct) {
    if (!answer || !crq) {
      throw new Error('We need a rule question and answer');
    }
    //we only need to communicate with the LMS for non-anonymous sessions
    if ($scope.sessionId) {
      // FIXME: conceptUid is not a field on the ruleQuestion. How can we get to the point where this works?
      // ConceptResult.saveToFirebase($scope.sessionId, crq.conceptUid, {
      //   answer: answer,
      //   correct: correct ? 1 : 0
      // });
    }

    if (correct || crq.attempts >= $scope.numAttempts) {
      $scope.showNextQuestion = true;
      var passageId = $state.params.passageId;
      if (passageId) {
        SentenceLocalStorage.storeTempResult(passageId, crq, answer, correct);
      }
    }
  });

  //If we have a student param, then we have a valid session
  if ($state.params.student) {
    $scope.sessionId = $state.params.student;
  }

  //This is what we need to do after a student has completed the set
  $scope.finish = function () {
    var passageId = $state.params.passageId;
    if (passageId) { // Prevent explosions when there is no passage ID (started 'Sentence Writing' activity).
      var tempResults = SentenceLocalStorage.saveResults(passageId);
      AnalyticsService.trackSentenceWritingSubmission(tempResults, passageId);
    } else {
      passageId = null;
    }
    return finalizeService($scope.sessionId, passageId).then(function () {
      $state.go('.results', {
        student: $state.params.student
      });
    });
  };

  /*
   * Next question is a scope function that is called
   * when the student presses the next button. It advances
   * the pointer on the list of questions.
   */
  $scope.nextQuestion = function () {
    $scope.showNextQuestion = false;
    var crq = $scope.currentRuleQuestion;
    var ncrq = $scope.questions[_.indexOf($scope.questions, crq) + 1];
    if (!ncrq) {
      $scope.number = $scope.number + 1;
      $scope.finish();
      return;
    }
    $scope.number = $scope.number + 1;
    $scope.currentRuleQuestion = ncrq;
  };

  /*
   * Here, we check for the **All Correct from PF Flag**
   */

  $scope.checkIfAllPfCorrect = function () {
    if ($state.params.pfAllCorrect) {
      return $scope.finish();
    }
  };
  $scope.checkIfAllPfCorrect();

  /*
   * Function execution stops here if the **All Correct PF Flag
   * is true.
   */

  /*
   * If we have a uid of a sentence writing activity, we fetch,
   * then build a list of rule ids with their needed quantity.
   *
   * If we have ids of rules, we default to a quantity of 3
   * for the max number of rule questions to retrieve.
   */
  var loadPromise;
  if ($state.params.uid) {
    loadPromise = GrammarActivity.getById($state.params.uid);
  } else if ($state.params.ids) {
    var ids = _.uniq($state.params.ids.split(','));
    loadPromise = GrammarActivity.fromRuleIds(ids);
  } else {
    throw new Error('Unable to load sentence writing. Please provide an activity ID or a set of rule IDs.');
  }
  loadPromise.then(function (grammarActivity) {
    $scope.sentenceWriting = grammarActivity;
    return grammarActivity.getQuestions();
  }).then(function (questions) {
    // FIXME: Get rid of this scope assignment and just use activity.selectedRuleQuestions.
    $scope.questions = questions;
    $scope.currentRuleQuestion = questions[0];
    $scope.showNextQuestion = false;
    $scope.showPreviousQuestion = false;
  });

  /*
   * Format Description
   * This function takes a description and splits the sentences
   * into a unordered list of phrases and example sentences.
   * These two lists are divided by a horizontal rule bar.
   */
  $scope.formatDescription = function (des) {
    if (!des) {
      return;
    }
    var entries = des.split('.');
    var phrases = [];
    var sentences = [];
    _.each(entries, function (e) {
      e = '<li>' + e + '.</li>';
      if (e.indexOf(':') !== -1) {
        phrases.push(e);
      } else {
        sentences.push(e);
      }
    });
    var html = '<ul>' + phrases.join('') + '</ul><hr/><ul>' + sentences.join('') + '</ul>';
    return html;
  };
};
