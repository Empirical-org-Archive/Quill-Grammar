'use strict';

// Finalize the play session. Save results to localStorage and the LMS.

module.exports =
angular.module('quill-grammar.services.finalize', [
  require('empirical-angular').name,
  require('../../../.tmp/config').name,
  require('./calculatePercentage.js').name
])
.factory('finalizeService', function ($q, ConceptTagResult, ActivitySession, calculatePercentageService) {
  function finalize(sessionId) {
    if (sessionId) {
      //Do LMS logging if we have a sessionId
      return ConceptTagResult.findAsJsonByActivitySessionId(sessionId).then(function (list) {
        return ActivitySession.finish(sessionId, {
          // TODO: The API for concept tags needs to be sorted out on the LMS
          // before this will work.
          // concept_tag_results: list,
          percentage: calculatePercentageService(list)
        });
      }, function (e) {
        throw e;
      }).then(function () {
        return ConceptTagResult.removeBySessionId(sessionId);
      }, function (e) {
        throw e;
      }).catch(function (e) {
        console.log('An error occurred while saving results to the LMS', e);
        throw e;
      });
    } else {
      return $q.when();
    }
  }

  return finalize;
});
