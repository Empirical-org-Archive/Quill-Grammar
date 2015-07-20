/* global _ */

'use strict';

// Encapsulate analytics logic for the app.

module.exports =
angular.module('quill-grammar.services.analytics', [
  'angulartics',
])
.factory('AnalyticsService', function ($q, $analytics) {
  /*
   * Function to map and send analytic information
   */
  function trackSentenceWritingSubmission(results, passageId) {
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

  return {
    trackSentenceWritingSubmission: trackSentenceWritingSubmission
  };
});
