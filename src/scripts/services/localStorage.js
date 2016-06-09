/* global _ */

'use strict';

// Encapsulate analytics logic for the app.

module.exports =
angular.module('quill-grammar.services.localStorage', [
  'LocalStorageModule',
])
.factory('SentenceLocalStorage', function ($q, localStorageService) {
  function storeTempResult(passageId, crq, answer, correct) {
    var key = 'sw-temp-' + passageId;
    var rs = localStorageService.get(key);
    if (!rs) {
      rs = [];
    }
    rs.push({
      conceptClass: crq.conceptCategory,
      correct: correct,
      answer: answer
    });
    localStorageService.set(key, rs);
  }

  /*
   * Function to store anonymous session in local storage.
   */
  function storeAnonResult(uid, conceptUid, metadata) {
    var key = 'anon-' + uid;
    var rs = localStorageService.get(key);
    if (!rs) {
      rs = [];
    }
    rs.push({
      concept_uid: conceptUid,
      metadata: metadata
    });
    localStorageService.set(key, rs);
  }

  /*
   * Function to map temporary local results into
   */
  function saveLocalResults(passageId) {
    if (passageId) {
      var tempKey = 'sw-temp-' + passageId;
      var trs = localStorageService.get(tempKey);
      var rs = _.chain(trs)
        .groupBy('conceptClass')
        .map(function (entries, cc) {
          return {
            conceptClass: cc,
            total: entries.length,
            correct: _.filter(entries, function (v) { return v.correct; }).length
          };
        })
        .value();
      localStorageService.set('sw-' + passageId, rs);
      localStorageService.remove(tempKey);
      return trs; // Return temp results so they can be sent to the analytics service. Why not just send the final results?
    }
  }

  return {
    storeTempResult: storeTempResult,
    storeAnonResult: storeAnonResult,
    saveResults: saveLocalResults
  };
});
