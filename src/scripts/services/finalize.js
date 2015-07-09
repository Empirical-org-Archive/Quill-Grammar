/* global _ */

'use strict';

// Finalize the play session. Save results to localStorage and the LMS.

module.exports =
angular.module('quill-grammar.services.finalize', [
  require('empirical-angular').name,
  require('../../../.tmp/config').name,
  'angulartics',
  'LocalStorageModule'
])
.factory('finalizeService', function ($q, ConceptTagResult, ActivitySession, $analytics, localStorageService) {
  /*
   * Function to map and send analytic information
   */
  function sendSentenceWritingAnalytics(results, passageId) {
    var event = 'Sentence Writing Submitted';
    var c = _.pluck(results, 'correct');
    var attrs = {
      uid: passageId,
      answers: _.pluck(results, 'answer'),
      correct: c,
      conceptCategory: _.pluck(results, 'conceptClass'),
      total: results.length,
      numCorrect: c.length
    };

    $analytics.eventTrack(event, attrs);
  }

  /*
   * Function to map temporary local results into
   */
  function saveLocalResults(passageId) {
    if (passageId) {
      var tempKey = 'sw-temp-' + passageId;
      var trs = localStorageService.get(tempKey);
      sendSentenceWritingAnalytics(trs, passageId);
      var rs = _.chain(trs)
        .groupBy('conceptClass')
        .map(function (entries, cc) {
          return {
            conceptClass: cc,
            total: entries.length,
            correct: _.filter(entries, function (v) { return v.correct; }).length
          };
        })
        .value();
      localStorageService.set('sw-' + passageId, rs);
      localStorageService.remove(tempKey);
    }
  }

  function finalize(sessionId, passageId) {
    var d = $q.defer();
    var p = d.promise;
    saveLocalResults(passageId);

    if (sessionId) {
      //Do LMS logging if we have a sessionId
      p.then(function () {
        return ConceptTagResult.findAsJsonByActivitySessionId(sessionId)
          .then(function (list) {
            return ActivitySession.finish(sessionId, {
              concept_tag_results: list,
              percentage: 1,
            });
          })
          .then(function () {
            return ConceptTagResult.removeBySessionId(sessionId);
          });
      });
    }
    d.resolve();
    return p;
  }

  return finalize;
});
