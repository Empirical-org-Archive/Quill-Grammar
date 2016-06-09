'use strict';

module.exports =
angular.module('quill-grammar.services.lms.activity-session', [])
/*@ngInject*/
.service('ActivitySession', function ActivitySession ($http, empiricalBaseURL) {
  var activitySession = this;

  function activitySessionUrl(id) {
    return empiricalBaseURL + '/activity_sessions/' + id;
  }

  function update(id, putData) {
    return $http.put(activitySessionUrl(id), putData);
  }

  function createAnon(postData) {
    return $http.post(activitySessionUrl(""), postData);
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
