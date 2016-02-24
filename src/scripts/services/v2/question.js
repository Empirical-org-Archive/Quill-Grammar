'use strict';

/*
 * This is a wrapper around what is currently called
 * 'ruleQuestion'.
 */

module.exports =
angular.module('quill-grammar.services.question', [
  'underscore',
])
/*@ngInject*/
.factory('Question', function (_) {
  function Question(data) {
    if (data) {
      _.extend(this, data);
    }
    return this;
  }

  Question.MAX_NUM_ATTEMPTS = 2;
  Question.MAX_FIX_ATTEMPTS = 2;

  Question.ResponseStatus = {
    DEFAULT: 0,
    TYPING_ERROR_NON_STRICT: 2,
    TYPING_ERROR_NON_STRICT_UNFIXED: 3,
    INCORRECT: 4,
    CORRECT: 5,
    NO_ANSWER: 6,
    NOT_LONG_ENOUGH: 7,
    TOO_MANY_ATTEMPTS: 8,
  };

  var delim = {
    open: '{',
    close: '}'
  };

  var delimRegEx = {
    open: new RegExp(delim.open, 'g'),
    close: new RegExp(delim.close, 'g')
  };

  var matchAllDelimsStr = delim.open + '([^' + delim.open + '^' + delim.close + '.]*)' + delim.close;

  function removeDelimeters(b) {
    if (typeof (b) !== 'string') {
      throw new Error('Input must be type string removeDelimeters');
    }
    return b.replace(delimRegEx.open, '').replace(delimRegEx.close, '');
  }

  function getCorrectString(b) {
    var answers = _.chain(b)
      .map(removeDelimeters)
      .value();
    return '<ul><li>' + answers.join('</li><li>') + '</ul>';
  }

  Question.ResponseMessages = {};
  Question.ResponseMessages[Question.ResponseStatus.DEFAULT] = 'Check Work';
  Question.ResponseMessages[Question.ResponseStatus.NOT_LONG_ENOUGH] = '<b>Try again!</b>Your answer is not long enough.';
  Question.ResponseMessages[Question.ResponseStatus.INCORRECT] = '<b>Try Again!</b> Unfortunately, that answer is incorrect.';
  Question.ResponseMessages[Question.ResponseStatus.TYPING_ERROR_NON_STRICT] = 'You are correct, but you have some typing errors. Please correct them to continue.';
  Question.ResponseMessages[Question.ResponseStatus.TYPING_ERROR_NON_STRICT_UNFIXED] = 'You are correct, but you have some typing errors. You may correct them or continue.';
  Question.ResponseMessages[Question.ResponseStatus.TOO_MANY_ATTEMPTS] = function (question) {
    return '<b>Incorrect.</b> Correct Answer: ' + getCorrectString(_.pluck(question.answers, 'text'));
  };
  Question.ResponseMessages[Question.ResponseStatus.CORRECT] = '<b>Well done!</b> That\'s the correct answer.';
  Question.ResponseMessages[Question.ResponseStatus.NO_ANSWER] = 'You must enter a sentence for us to check.';

  function compareEntireAnswerToAnswers(answer) {
    return function (b) {
      var cleaned = removeDelimeters(b);
      return answer === cleaned;
    };
  }

  Question.prototype.ensureLengthIsProper = function (answer) {
    var threshold = 0.8;
    return function (possibleAnswer) {
      var b = removeDelimeters(possibleAnswer);
      return (answer.length / b.length) >= threshold;
    };
  };

  Question.prototype.compareGrammarElementToAnswers = function (answer) {
    var b = this.getPossibleAnswers();
    if (!answer) {
      return false;
    }
    return _.any(b, function (possibleAnswer) {
      var reg = new RegExp(matchAllDelimsStr, 'g');
      var grammarElements = [];
      var tmpArray;
      while ((tmpArray = reg.exec(possibleAnswer)) !== null) {
        grammarElements.push(tmpArray[1]);
      }
      return _.every(grammarElements, function (element) {
        var r = new RegExp('(^|\\W{1,1})' + element + '(\\W{1,1}|$)', 'g');
        return answer.search(r) !== -1;
      });
    });
  };

  Question.prototype.answerIsCorrect = function () {
    return this.status === Question.ResponseStatus.CORRECT ||
      this.status === Question.ResponseStatus.TYPING_ERROR_NON_STRICT;
  };

  Question.prototype.checkAnswer = function () {
    var answer = this.response;
    if (!answer) {
      this.status = Question.ResponseStatus.NO_ANSWER;
      return;
    }
    var possibleAnswers = this.getPossibleAnswers();
    var exactMatch = _.any(possibleAnswers, compareEntireAnswerToAnswers(answer));
    if (exactMatch) {
      this.status = Question.ResponseStatus.CORRECT;
    } else if (!_.every(possibleAnswers, this.ensureLengthIsProper(answer))) {
      this.status = Question.ResponseStatus.NOT_LONG_ENOUGH;
    } else if (this.compareGrammarElementToAnswers(answer)) {
      if (this.fixAttempts) {
        this.fixAttempts++;
      } else {
        this.fixAttempts = 1;
      }
      if (this.fixAttempts >= Question.MAX_FIX_ATTEMPTS) {
        this.status = Question.ResponseStatus.TYPING_ERROR_NON_STRICT_UNFIXED;
      } else {
        this.status = Question.ResponseStatus.TYPING_ERROR_NON_STRICT;
      }
    } else {
      this.status = Question.ResponseStatus.INCORRECT;
      if (this.attempts) {
        this.attempts++;
      } else {
        this.attempts = 1;
      }
    }



    if (this.attempts >= Question.MAX_NUM_ATTEMPTS) {
      if (!this.answerIsCorrect()) {
        this.status = Question.ResponseStatus.TOO_MANY_ATTEMPTS;
      }
    }
    return;
  };

  Question.prototype.getPossibleAnswers = function () {
    return _.pluck(this.answers, 'text');
  };

  Question.prototype.getResponseMessage = function () {
    var msg = Question.ResponseMessages[this.status];
    if (_.isFunction(msg)) {
      return msg(this);
    } else {
      return msg;
    }
  };

  return Question;
});
