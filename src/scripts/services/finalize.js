/* global _ */

'use strict';

// Finalize the play session. Save results to localStorage and the LMS.

module.exports =
angular.module('quill-grammar.services.finalize', [
  require('empirical-angular').name,
  require('../../../.tmp/config').name
])
.factory('finalizeService', function ($q, ConceptTagResult, ActivitySession) {
  function finalize(sessionId) {
    var d = $q.defer();
    var p = d.promise;

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
