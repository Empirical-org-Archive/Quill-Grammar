'use strict';

function show() {
  return {
    restrict: 'E',
    templateUrl: 'question.show.html',
    scope: {
      question: '='
    },
  };
}

module.exports.show = show;
