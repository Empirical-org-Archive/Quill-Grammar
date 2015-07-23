'use strict';

// Finalize the play session. Save results to localStorage and the LMS.

module.exports =
angular.module('quill-grammar.services.finalize', [
  require('empirical-angular').name,
  require('../../../.tmp/config').name,
  require('./calculatePercentage.js').name,
  require('./localStorage.js').name
])
.factory('finalizeService', function ($q, ConceptTagResult, ActivitySession, calculatePercentageService, localStorageService) {
  function finalize(sessionId, passageId) {
    var pfResults;
    if (passageId) {
      pfResults = localStorageService.get('pf-' + passageId);
    } else {
      pfResults = [];
    }

    if (sessionId) {
       //Do LMS logging if we have a sessionId
      return ConceptTagResult.findAsJsonByActivitySessionId(sessionId).then(function (list) {
        return ActivitySession.finish(sessionId, {
          // FIXME: Uncommenting this line, i.e. sending concept tags to the LMS, is currently broken.
          // Do not uncomment this line until that part of the integration works on the LMS.
          // concept_tag_results: list,
          percentage: calculatePercentageService(list, pfResults)
        });
      }).then(function () {
        return ConceptTagResult.removeBySessionId(sessionId);
      }).catch(function (e) {
        console.log('An error occurred while saving results to the LMS', e);
        throw e;
      });
    } else {
      // Finalize always returns a promise, so anonymous sessions will
      // return a resolved promise.
      return $q.when();
    }
  }

  return finalize;
});
