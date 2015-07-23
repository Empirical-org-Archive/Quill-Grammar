'use strict';

module.exports =

/*@ngInject*/
function SentencePlayCtrl (
  $scope, $state, SentenceWritingService, RuleService, _,
  ConceptTagResult, ActivitySession, SentenceLocalStorage, $analytics,
  AnalyticsService, finalizeService
) {
  $scope.$watch('currentRuleQuestion', function (crq) {
    if (_.isObject(crq)) {
      $scope.currentRule = $scope.swSet[crq.ruleIndex];
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
    if ($scope.sessionId) {
      //we only need to communicate with the LMS if there is a valid session
      ConceptTagResult.save($scope.sessionId, {
        concept_tag: crq.conceptTag,
        concept_class: crq.conceptClass,
        concept_category: crq.conceptCategory,
        concept_id: crq.conceptId,
        answer: answer,
        correct: correct ? 1 : 0
      });
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

  function errorStateChange() {
    $state.go('index');
  }

  /*
   * Retrieves the corresponding quantity of rule questions
   * for each rule id. It sets up the $scope parameters at
   * the first question.
   */
  function retrieveNecessaryRules(ruleIds, quantities) {
    RuleService.getRules(ruleIds).then(function (resolvedRules) {
      $scope.swSet = _.chain(resolvedRules)
        .map(function (rr, i) {
          rr.selectedRuleQuestions = _.chain(rr.resolvedRuleQuestions)
            .sample(quantities[i])
            .map(function (rrq) {
              rrq.ruleIndex = i;
              return rrq;
            })
            .value();
          return rr;
        })
        .value();

      $scope.questions = _.chain($scope.swSet)
        .pluck('selectedRuleQuestions')
        .flatten()
        .value();

      $scope.currentRuleQuestion = $scope.questions[0];
      $scope.showNextQuestion = false;
      $scope.showPreviousQuestion = false;
    }, function () {
      //errorStateChange();
    });
  }

  /*
   * If we have a uid of a sentence writing activity, we fetch,
   * then build a list of rule ids with their needed quantity.
   *
   * If we have ids of rules, we default to a quantity of 3
   * for the max number of rule questions to retrieve.
   */
  if ($state.params.uid) {
    SentenceWritingService.getSentenceWriting($state.params.uid).then(function (sw) {
      $scope.sentenceWriting = sw;
      var ruleIds = _.pluck(sw.rules, 'ruleId');
      var quantities = _.pluck(sw.rules, 'quantity');
      return retrieveNecessaryRules(ruleIds, quantities);
    }, errorStateChange);
  } else if ($state.params.ids) {
    var ids = _.uniq($state.params.ids.split(','));
    var quantities = _.chain(ids)
      .map(function () { return 3; })
      .value();
    retrieveNecessaryRules(ids, quantities);
  }

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
