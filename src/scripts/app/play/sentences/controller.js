'use strict';

module.exports =

/*@ngInject*/
function SentencePlayCtrl(
  $scope, $state, SentenceWritingService, RuleService, _,
  ConceptTagResult, ActivitySession, localStorageService
) {

  $scope.$on('$locationChangeStart', function(event, next) {
    if (next.indexOf('gen-results') !== -1) {
      console.log('allow transition');
    } else {
      console.log('not allowing');
      event.preventDefault();
    }
  });

  $scope.$watch('currentRuleQuestion', function(crq) {
    if (_.isObject(crq)) {
      $scope.currentRule = $scope.swSet[crq.ruleIndex];
    }
  });

  $scope.partnerIframe = $state.params.partnerIframe;

  /*
   * This is some extra stuff for the partner integration
   * TODO move this out of here
   */
  //Add in some custom images for the 3 stories we are showcasing
  $scope.pfImages = {
    '70B-T6vLMTM9zjQ9LCwoCg': 'the_princes_and_the_turtle_story_header.png',
    'MJCtkml_69W2Dav79v4r9Q': 'ernest_shackleton_story_header.png',
    'Yh49ICvX_YME8ui7cDoFXQ': 'the_apollo_8_photograph_story_header.png'
  };

  $scope.pfTitles = {
    '70B-T6vLMTM9zjQ9LCwoCg': 'The Princess and the Turtle',
    'MJCtkml_69W2Dav79v4r9Q': 'Ernest Shackleton Escapes the Antarctic',
    'Yh49ICvX_YME8ui7cDoFXQ': 'The Apollo 8 Photograph'
  };

  if ($state.params.passageId) {
    $scope.passageImageUrl = $scope.pfImages[$state.params.passageId];
    $scope.passageTitle = $scope.pfTitles[$state.params.passageId];
  }

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
      var passageId = $state.params.passageId;
      if (passageId) {
        var key = 'sw-temp-' + passageId;
        var rs = localStorageService.get(key);
        if (!rs) {
          rs = [];
        }
        rs.push({
          conceptClass: crq.conceptCategory,
          correct: correct
        });
        localStorageService.set(key, rs);
      }
    }
  });

  //If we have a student param, then we have a valid session
  if ($state.params.student) {
    $scope.sessionId = $state.params.student;
  }

  /*
   * Function to map temporary local results into
   */
  function saveLocalResults() {
    var passageId = $state.params.passageId;
    if (passageId) {
      var tempKey = 'sw-temp-' + passageId;
      var trs = localStorageService.get(tempKey);
      var rs = _.chain(trs)
        .groupBy('conceptClass')
        .map(function(entries, cc) {
          return {
            conceptClass: cc,
            total: entries.length,
            correct: _.filter(entries, function(v) { return v.correct; }).length
          };
        })
        .value();
      localStorageService.set('sw-' + passageId, rs);
      localStorageService.remove(tempKey);
    }
  }

  //This is what we need to do after a student has completed the set
  $scope.finish = function() {
    var sid = $scope.sessionId;
    var p = null;
    saveLocalResults();
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
      $state.go('.results', {
        partnerIframe: true,
        passageId: $state.params.passageId
      });
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

  /*
   * Format Description
   */
  $scope.formatDescription = function(des) {
    if (!des) {
      return;
    }
    var entries = des.split('.');
    var phrases = [];
    var sentences = [];
    _.each(entries, function(e) {
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
