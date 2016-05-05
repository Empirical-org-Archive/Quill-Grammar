/* global SpeechSynthesisUtterance */
'use strict';

module.exports =

/*@ngInject*/
function SentencePlayCtrl (
  $scope, $state, _,
  SentenceLocalStorage,
  AnalyticsService, finalizeService,
  GrammarActivity,
  TypingSpeed
) {
  $scope.number = 0;
  $scope.previousConcepts = [];

  //If we have a student param, then we have a valid session
  if ($state.params.student) {
    $scope.sessionId = $state.params.student;
  }

  $scope.showConceptOverview = false;
  $scope.$on('showModal', function () {$scope.showConceptOverview = true;});
  $scope.$on('hideModal', function () {$scope.showConceptOverview = false;});
  //This is what we need to do after a student has completed the set
  $scope.finish = function () {
    $scope.saving = true;
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
    }).catch(function (e) {
      console.log('An error occurred while saving results to the LMS inside controller', e);
      $scope.saving = false;
      $scope.error = true;
      throw e;
    });;
  };

  /*
   * Next question is a scope function that is called
   * when the student presses the next button. It advances
   * the pointer on the list of questions.
   */
  $scope.nextQuestion = function () {
    var nextQuestion = $scope.questions[_.indexOf($scope.questions, $scope.currentQuestion) + 1];
    if (!nextQuestion) {
      $scope.currentQuestion = null;
      $scope.currentConcept = null;
      $scope.number = $scope.number + 1;
      $scope.finish();
      return;
    }
    $scope.number = $scope.number + 1;
    $scope.currentQuestion = nextQuestion;
    $scope.currentConcept = $scope.grammarActivity.getConceptForQuestion($scope.currentQuestion);
    $scope.showConceptOverview = (_.indexOf($scope.previousConcepts, $scope.currentConcept) === -1);
    $scope.previousConcepts.push($scope.currentConcept);
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
    var ids = _.map(_.uniq($state.params.ids.split(',')), Number);
    loadPromise = GrammarActivity.fromPassageResults(ids, $state.params.passageId);
  } else if (!$state.params.pfAllCorrect) {
    throw new Error('Unable to load sentence writing. Please provide an activity ID or a set of rule IDs.');
  }
  if (loadPromise) {
    loadPromise.then(function (grammarActivity) {
      $scope.grammarActivity = grammarActivity;
      // FIXME: Get rid of this scope assignment and just use activity.selectedRuleQuestions.
      $scope.questions = grammarActivity.questions;
      // Get partial session here.
      if ($state.params.student) {
        decideState()
      } else {
        $scope.currentQuestion = $scope.questions[0];
        displayActivity()
        $scope.resuming = false;
      }
    });
  }

  function decideState() {
    $scope.resuming = true;
    $scope.grammarActivity.getSession($state.params.student).then(function (value) {
      var swConcepts = getSentenceWritingConceptResults(value)
      if (swConcepts.length >= $scope.questions.length) {
        $scope.resuming = false;
        $scope.finish();
      }
      else if (swConcepts.length > 0) {
        resumeLesson(swConcepts)
        displayActivity()
        setTimeout(function() {
          $scope.resuming = false;
          $scope.$apply()
        }, 1000)
      } else {
        $scope.currentQuestion = $scope.questions[0];
        displayActivity()
        $scope.resuming = false;
      }

    })
  }

  function displayActivity() {
    $scope.currentConcept = $scope.grammarActivity.getConceptForQuestion($scope.currentQuestion);
    $scope.showConceptOverview = (_.indexOf($scope.previousConcepts, $scope.currentConcept) === -1);
    $scope.previousConcepts.push($scope.currentConcept);
    $scope.showNextQuestion = false;
    TypingSpeed.reset();
  }

  function resumeLesson(swConcepts) {
    var completedQuestionIds = getQuestionIDs(swConcepts)
    var grouped =  groupQuestionsByAnsweredState(completedQuestionIds)
    $scope.questions = (grouped.answered || []).concat(grouped.unanswered);
    $scope.currentQuestion = $scope.questions[swConcepts.length];
    $scope.number = swConcepts.length;
  }

  function getQuestionIDs(values) {
    return _.map(values, function(val) { return val.metadata.questionUid } );
  }

  function getSentenceWritingConceptResults(value) {
    return _.reject(value, function (val) {
      return val.metadata.index
    })
  }

  function groupQuestionsByAnsweredState(completedQuestionIds) {
    return _.groupBy($scope.grammarActivity.questions, function(question){
      return _.indexOf(completedQuestionIds, question.uid) !== -1 ? 'answered' : 'unanswered';
    });
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
    des = des.replace(/\.(?!")/gi, '.<br>');
    des = des.replace(/\."/gi, '."<br>');
    des = des.replace(/\?(?!")/gi, '?<br>');
    des = des.replace(/\?"/gi, '?"<br>');
    des = des.replace(/\!(?!")/gi, '!<br>');
    des = des.replace(/\!"/gi, '!"<br>');
    var entries = des.split('<br>');
    // var phrases = [];
    var sentences = [];
    _.each(entries, function (e) {
      if (e.length > 4) {
        e = '<li>' + e + '</li>';
      }
      // if (e.indexOf(':') !== -1) {
      //   phrases.push(e);
      // } else {
      sentences.push(e);
      // }
    });
    var html = '<ul>' + sentences.join('') + '</ul><hr/>';
    return html;
  };

  $scope.speak = function (text) {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      } else {
        var timer = setInterval(function () {
          var voices = window.speechSynthesis.getVoices();
          if (voices.length !== 0) {
            var msg = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/gi, ''));
            msg.voice = _.where(voices, {name: 'Samantha'})[0];
            window.speechSynthesis.speak(msg);
            clearInterval(timer);
          }
        }, 200);
      }
    }
  };
};
