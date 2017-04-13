'use strict';

module.exports =
angular.module('quill-grammar.services.lms.activity-session', [])
/*@ngInject*/
.service('ActivitySession', function ActivitySession ($http, empiricalBaseURL) {
  var activitySession = this;

  function activitySessionUrl(id) {
    return empiricalBaseURL + '/activity_sessions/' + id;
  }

  function getSessionInfo(id) {
    return $http.get(activitySessionUrl(id))
  }

  function update(id, putData) {
    return $http.put(activitySessionUrl(id), putData);
  }

  function createAnon(postData) {
    return $http.post(activitySessionUrl(''), postData);
  }

  activitySession.info = function (sessionId) {
    return getSessionInfo(sessionId).then(function next (response) {
      return response.data.activity_session;
    });
  };

  activitySession.redirectIfFinished = function(sessionId) {
    activitySession.info(sessionId).then(function(info) {
      if (info.state === 'finished') {
        // slice the url to get rid of the API -- this is the only place we want to
        // go to a core route without it
        window.location = `${empiricalBaseURL.slice(0, -8)}/activity_sessions/${info.uid}/play`;
      }
    })
  }

  /*
   * Mark the activity session as finished. The promise receives
   * the activity session JSON returned from the LMS.
   *
   * Example:
   * ActivitySession.finish(User.currentUser.sid).then(function next(activitySession) {
   *   // Do stuff here
   * });
   *
   * TODO: Serialize concept tag results and send as part of the
   * request body.
   */
  activitySession.finish = function (sessionId, putData) {
    putData.state = 'finished';
    return update(sessionId, putData).then(function next (response) {
      return response.data.activity_session;
    });
  };

  activitySession.create = function (postData) {
    postData.state = 'finished';
    return createAnon(postData).then(function next (response) {
      return response.data.activity_session;
    });
  };
});
