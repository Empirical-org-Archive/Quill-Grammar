'use strict';

module.exports =

/*@ngInject*/
function SentencePlayCtrl(
  $scope, $state, SentenceWritingService, RuleService, _,
  ConceptTagResult, ActivitySession
) {

  $scope.$watch('currentRuleQuestion', function(crq) {
    if (_.isObject(crq)) {
      $scope.currentRule = $scope.swSet[crq.ruleIndex];
    }
  });

  $scope.number = 0;
  $scope.numAttempts = 2;

  $scope.$on('answerRuleQuestion', function(e, crq, answer, correct) {
    if (!answer || !crq) {
      throw new Error('We need a rule question and answer');
    }
    if ($scope.sessionId) {
      //we only need to communicate with the LMS if there is a valid session
      ConceptTagResult.save($scope.sessionId, {
        concept_tag: crq.conceptTag,
        concept_class: crq.conceptClass,
        concept_category: crq.conceptCategory,
        answer: answer,
        correct: correct ? 1 : 0
      });
    }

    if (correct || crq.attempts >= $scope.numAttempts) {
      $scope.showNextQuestion = true;
    }
  });

  //If we have a student param, then we have a valid session
  if ($state.params.student) {
    $scope.sessionId = $state.params.student;
  }

  //This is what we need to do after a student has completed the set
  $scope.finish = function() {
    var sid = $scope.sessionId;
    var p = null;
    if (sid) {
      //Do LMS logging if we have a sessionId
      p = ConceptTagResult.findAsJsonByActivitySessionId(sid)
      .then(function(list) {
        return ActivitySession.finish(sid, {
          concept_tag_results: list,
          percentage: 1,
        });
      })
      .then(function() {
        return ConceptTagResult.removeBySessionId(sid);
      });
    }
    if (p) {
      p.then(function() {
        $state.go('.results', {student: sid});
      });
    } else {
      $state.go('.results', {internal: true});
    }
  };

  $scope.nextQuestion = function() {
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

  if ($state.params.uid) {
    SentenceWritingService.getSentenceWriting($state.params.uid).then(function(sw) {
      $scope.sentenceWriting = sw;
      var ruleIds = _.pluck(sw.rules, 'ruleId');
      var quantities = _.pluck(sw.rules, 'quantity');
      return retrieveNecessaryRules(ruleIds, quantities);
    }, errorStateChange);
  } else if ($state.params.ids) {
    var ids = _.uniq($state.params.ids.split(','));
    var quantities = _.chain(ids)
      .map(function() { return 3; })
      .value();
    retrieveNecessaryRules(ids, quantities);
  }

  function retrieveNecessaryRules(ruleIds, quantities) {
    RuleService.getRules(ruleIds).then(function(resolvedRules) {
      $scope.swSet = _.chain(resolvedRules)
        .map(function(rr, i) {
          rr.selectedRuleQuestions = _.chain(rr.resolvedRuleQuestions)
            .sample(quantities[i])
            .map(function(rrq) {
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
    }, function() {
      //errorStateChange();
    });
  }

  function errorStateChange() {
    $state.go('index');
  }
};
