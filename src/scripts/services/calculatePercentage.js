'use strict';

module.exports =
angular.module("quill-grammar.services.calculatePercentage", [])
.factory('calculatePercentageService', function () {
  var calculatePercentage = function (conceptTagResults) {
    var numCorrect, percentage;
    if (conceptTagResults.length == 0) {
      percentage = 0;
    } else {
      numCorrect = _.reduce(conceptTagResults, function (memo, ctr) {
        return memo + ctr.correct;
      }, 0)
      percentage = numCorrect / conceptTagResults.length;
    }
    return percentage;
  }
  return calculatePercentage;
})