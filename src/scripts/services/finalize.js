'use strict';

// Finalize the play session. Save results to localStorage and the LMS.

module.exports =
angular.module('quill-grammar.services.finalize', [
  require('empirical-angular').name,
  require('../../../.tmp/config').name,
  require('./calculatePercentage.js').name
])
.factory('finalizeService', function ($q, ConceptTagResult, ActivitySession, calculatePercentage) {
  function finalize(sessionId) {
    var p = $q.when();

    if (sessionId) {
      //Do LMS logging if we have a sessionId
      p.then(function () {
        return ConceptTagResult.findAsJsonByActivitySessionId(sessionId)
          .then(function (list) {
            return ActivitySession.finish(sessionId, {
              concept_tag_results: list,
              percentage: calculatePercentage(list),
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
