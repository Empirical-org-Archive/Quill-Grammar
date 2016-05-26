/* global _ */
/* global _ */
/* global _ */
/* global atatus */
/* jshint unused: vars */

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

  function trackFailedToSaveActivity(sessionId) {
    var event = 'Failed to save activity';
    var attrs = {
      uid: sessionId
    };

    $analytics.eventTrack(event, attrs);
  }

  return {
    trackSentenceWritingSubmission: trackSentenceWritingSubmission,
    trackFailedToSaveActivity: trackFailedToSaveActivity
  };
})

.factory('errorHttpInterceptor', ['$q', '$window', function ($q, $window) {
  return {
    responseError: function responseError (rejection) {
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

.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('errorHttpInterceptor');
}])

.factory('errors', ['$window', '$log', function errorLoggerFactory ($window, $log) {
  // I report errors to the remote server.
  function report(error) {
    // In this case, we're going to be using New Relic's Browser API to
    // report JavaScript errors that originate from within the AngularJS
    // application try / catch blocks (which is why the global error
    // handler doesn't see them). But, since New Relic is a per-server
    // cost, we might not have it enabled in every environment. Let's
    // check to see if the API exists before we try to use it.
    if ($window.NREUM && $window.NREUM.noticeError) {
      try {
        $window.NREUM.noticeError(error);
      // If logging errors is causing an error, just swallow those
      // errors; attempting to log these errors might lock the browser
      // in an infinite loop.
      } catch (newRelicError) {
        $log.error(newRelicError);
      }
    } else {
      $log.info('New Relic not available to record error.');
    }
    if ($window.atatus) {
      $window.atatus.notify(error);
    } else {
      $log.info('Atatus not available to record error.');
    }
    $log.error(error);
  }
  // Return the public API.
  return ({
    report: report
  });
}])

.factory('$exceptionHandler', ['$window', 'errors', function ($window, errors) {
  return function (exception, cause) {
    if (exception.stack) {
      exception.stack = exception.stack.replace('new <anonymous>', '<anonymous>');
    }

    if ($window.NREUM) {
      $window.NREUM.noticeError(exception);
    }
    errors.report(exception);
  };
}]);
