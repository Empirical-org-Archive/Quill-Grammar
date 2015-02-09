'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      sentenceWriting: '='
    },
    templateUrl: 'sentenceWriting.html',
    controller: 'GrammarSentenceWritingCtrl'
  };
};
