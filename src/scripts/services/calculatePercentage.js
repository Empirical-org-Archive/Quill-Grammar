'use strict';

module.exports =
angular.module("quill-grammar.services.calculatePercentage", [])
.factory('calculatePercentageService', function () {
  var calculatePercentage = function () {
    return 0.6;
  }
  return calculatePercentage;
})