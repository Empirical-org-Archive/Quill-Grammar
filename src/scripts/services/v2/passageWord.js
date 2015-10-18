'use strict';

module.exports =
angular.module('quill-grammar.services.passageWord', [
  'underscore',
])
/*@ngInject*/
.factory('PassageWord', function (_) {
  function PassageWord(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }

  PassageWord.INCORRECT_ERROR = 'Incorrect';
  PassageWord.NOT_NECESSARY_ERROR = 'Not Necessary';
  PassageWord.CORRECT = 'Correct';

  // TODO: Copied from old ProofreadingService, clean this up.
  PassageWord.htmlMatches = function (text) {
    /* Returns null or an array of matches */
    //TODO Only looking for line break tags right now
    if (!text) {
      return null;
    }
    return text.match(/<\s*br\s*?\/>/g);
  };

  PassageWord.prototype.hasNotNecessaryError = function () {
    return this.type === PassageWord.NOT_NECESSARY_ERROR;
  };

  PassageWord.prototype.hasIncorrectError = function () {
    return this.type === PassageWord.INCORRECT_ERROR;
  };

  PassageWord.prototype.hasCorrect = function () {
    return this.type === PassageWord.CORRECT;
  };

  PassageWord.prototype.errorCounter = function () {
    return 'Edit ' + String(this.resultIndex + 1) + ' of ' + this.totalResults;
  };

  PassageWord.prototype.hasErrorToShow = function () {
    return _.any([this.hasNotNecessaryError.bind(this), this.hasCorrect.bind(this), this.hasIncorrectError.bind(this)], function (fn) {
      return fn();
    });
  };

  PassageWord.prototype.getErrorType = function () {
    return _.has(this, 'minus') ? PassageWord.INCORRECT_ERROR : PassageWord.NOT_NECESSARY_ERROR;
  };

  PassageWord.prototype.isValid = function () {
    if (_.has(this, 'minus')) {
      //A grammar entry
      return this.responseText === this.plus;
    } else {
      //A regular word
      return this.text === this.responseText;
    }
  };

  PassageWord.prototype.isBr = function () {
    return PassageWord.htmlMatches(this.responseText) !== null;
  };

  PassageWord.prototype.needsUnderlining = function () {
    return _.has(this, 'minus');
  };

  return PassageWord;
});
