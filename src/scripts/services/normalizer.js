'use strict';
var JsDiff = require('diff');
/*
 * This is a wrapper around what is currently called
 * 'ruleQuestion'.
 */

module.exports =
angular.module('quill-grammar.services.normalizer', ['underscore'])
.factory('Normalizer', function (_) {
  function Normalizer(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  };

  Normalizer.normalizeApostrophes = function (text) {
    return text.replace(/[\u201C\u201D]/g, '\u0022');
  };

  Normalizer.normalizeQuotations = function (text) {
    return text.replace(/[\u00B4\u0060\u2018\u2019]/g, '\u0027');
  };

  Normalizer.normalizeCommas = function(text) {
    return text.replace('‚', ',')
  };

  //TODO: make this chained
  Normalizer.superNormalize = function(text){
    var apostrophe = this.normalizeApostrophes(text);
    var quotations = this.normalizeQuotations(apostrophe);
    return this.normalizeCommas(quotations);
  }

  return Normalizer;
});
