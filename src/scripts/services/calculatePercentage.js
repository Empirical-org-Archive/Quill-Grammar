/* global _ */
'use strict';

module.exports =
angular.module('quill-grammar.services.calculatePercentage', [])
.factory('calculatePercentageService', function () {
  var calculatePercentage = function (conceptTagResults) {
    var numCorrect, numTotal;
    if (conceptTagResults.length) {
      numCorrect = _.reduce(conceptTagResults, function (memo, ctr) {
        return memo + ctr.metadata.correct;
      }, 0);
      numTotal = conceptTagResults.length;
    } else {
      numCorrect = 0;
      numTotal = 0;
    }

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
