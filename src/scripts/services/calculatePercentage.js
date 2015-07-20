/* global _ */
'use strict';

module.exports =
angular.module('quill-grammar.services.calculatePercentage', [])
.factory('calculatePercentageService', function () {
  var calculatePercentage = function (conceptTagResults, pfResults) {
    var swNumCorrect, swNumTotal;
    if (conceptTagResults.length) {
      swNumCorrect = _.reduce(conceptTagResults, function (memo, ctr) {
        return memo + ctr.correct;
      }, 0);
      swNumTotal = conceptTagResults.length;
    } else {
      swNumCorrect = 0;
      swNumTotal = 0;
    }
    var pfNumCorrect, pfNumTotal;
    if (pfResults.length) {
      // pfResults has a different data structure than conceptTagResults;
      // they are grouped by rule titles
      // so the value of 'correct' property (and of 'total' property) is not simply 1 or 0)
      // (which is why we cant simply determine pfNumTotal as pfResults.length)
      pfNumCorrect = _.reduce(pfResults, function (memo, r) {
        return memo + r.correct;
      }, 0);
      pfNumTotal = _.reduce(pfResults, function (memo, r) {
        return memo + r.total;
      }, 0);
    } else {
      pfNumCorrect = 0;
      pfNumTotal = 0;
    }

    var numCorrect, numTotal;
    numCorrect = swNumCorrect + pfNumCorrect;
    numTotal = swNumTotal + pfNumTotal;

    var percentage;

    if (numTotal) {
      percentage = (numCorrect / numTotal);
    } else {
      percentage = 0;
    }
    return percentage;
  };
  return calculatePercentage;
});
