/* global _ */
/* global _ */
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
    if (results === null) {
      results = {};
    }
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
})
.factory('errorHttpInterceptor', ['$q', '$window', function ($q, $window) {
  return {
    responseError: function responseError(rejection) {
      if ($window.atatus) {
        var message = 'AJAX Error: ' +
          rejection.config.method + ' ' +
          rejection.status + ' ' +
          rejection.config.url;
        atatus.notify(new Error(message), {
          config: rejection.config,
          status: rejection.status
        });
      }
      return $q.reject(rejection);
    }
  };
}])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('errorHttpInterceptor');
}])
.factory('$exceptionHandler', ['$window', function ($window) {
  return function (exception, cause) {
      if (exception.stack) {
          exception.stack = exception.stack.replace('new <anonymous>', '<anonymous>');
      }
      if ($window.atatus) {
          $window.atatus.notify(exception);
      }
  };
}]);
