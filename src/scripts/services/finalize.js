'use strict';

// Finalize the play session. Save results to localStorage and the LMS.

module.exports =
angular.module('quill-grammar.services.finalize', [
  require('../../../.tmp/config').name,
  require('./calculatePercentage.js').name,
  require('./localStorage.js').name,
  require('./lms/conceptResult.js').name,
  require('./lms/activitySession.js').name,
  require('./auth').name
])
.factory('finalizeService', function ($q, ConceptResult, ActivitySession, calculatePercentageService, localStorageService, QuillOAuthService) {
  function finalize(sessionId, passageId, activityUID) {
    var pfResults;
    if (passageId) {
      pfResults = localStorageService.get('anon-' + passageId);
    } else if (activityUID) {
      pfResults = localStorageService.get('anon-' + activityUID);
    } else {
      pfResults = [];
    }

    if (sessionId) {
      //Do LMS logging if we have a sessionId
      return ConceptResult.findAsJsonByActivitySessionId(sessionId).then(function (list) {
        list.forEach(function(conRes,index){conRes.metadata.questionNumber = index + 1});
        return ActivitySession.finish(sessionId, {
          concept_results: list,
          percentage: calculatePercentageService(list)
        });
      }).catch(function (e) {
        console.log('An error occurred while saving results to the LMS', e);
        throw e;
      }).then(function () {
        console.log('Removing session from Firebase');
        return ConceptResult.removeBySessionId(sessionId);
      }).then(function () {
        QuillOAuthService.expire();
      });
    } else {
      var list = pfResults;
      console.log(list);
      return ActivitySession.create({
        activity_uid: passageId || activityUID,
        concept_results: list,
        percentage: calculatePercentageService(list)
      }).then(function (e) {
        console.log('Removing session from Localhost');
        localStorageService.set('anon-' + passageId, []);
        localStorageService.set('anon-' + activityUID, []);
        return e;
      });
    }
  }

  return finalize;
});
