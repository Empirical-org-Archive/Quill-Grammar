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
    var p = $q.when();
    if (sessionId) {
      //Do LMS logging if we have a sessionId
      p.then(function () {
        var pfResults;
        if (passageId) {
          pfResults = localStorageService.get('pf-' + passageId);
        } else {
          pfResults = [];
        }

        return ConceptTagResult.findAsJsonByActivitySessionId(sessionId)
          .then(function (list) {
            return ActivitySession.finish(sessionId, {
              concept_tag_results: list,
              percentage: calculatePercentageService(list, pfResults)
            });
          })
          .then(function () {
            return ConceptTagResult.removeBySessionId(sessionId);
          });
      });
    }
    return p;
  }

  return finalize;
});
