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

  Question.ResponseStatus = {
    DEFAULT: 0,
    TYPING_ERROR_NON_STRICT: 2,
    INCORRECT: 4,
    CORRECT: 5,
    NO_ANSWER: 6,
    NOT_LONG_ENOUGH: 7,
    TOO_MANY_ATTEMPTS: 8,
  };

  Question.ResponseMessages = {};
  Question.ResponseMessages[Question.ResponseStatus.DEFAULT] = 'Check Work';
  Question.ResponseMessages[Question.ResponseStatus.NOT_LONG_ENOUGH] = '<b>Try again!</b>Your answer is not long enough.';
  Question.ResponseMessages[Question.ResponseStatus.INCORRECT] = '<b>Try Again!</b> Unfortunately, that answer is incorrect.';
  Question.ResponseMessages[Question.ResponseStatus.TYPING_ERROR_NON_STRICT] = 'You are correct, but you have some typing errors. You may correct them or continue.';
  Question.ResponseMessages[Question.ResponseStatus.TOO_MANY_ATTEMPTS] = function (question) {
    return '<b>Incorrect.</b> Correct Answer: ' + getCorrectString(_.pluck(question.answers, 'text'));
  };
  Question.ResponseMessages[Question.ResponseStatus.CORRECT] = '<b>Well done!</b> That\'s the correct answer.';
  Question.ResponseMessages[Question.ResponseStatus.NO_ANSWER] = 'You must enter a sentence for us to check.';

  var delim = {
    open: '{',
    close: '}'
  };

  function removeDelimeters(b) {
    if (typeof (b) !== 'string') {
      throw new Error('Input must be type string removeDelimeters');
    }
    return b.replace(delim.open, '').replace(delim.close, '');
  }

  function getCorrectString(b) {
    var answers = _.chain(b)
      .map(removeDelimeters)
      .value();
    return '<ul><li>' + answers.join('</li><li>') + '</ul>';
  }

  function compareEntireAnswerToAnswers(answer) {
    return function (b) {
      var cleaned = removeDelimeters(b);
      return answer === cleaned;
    };
  }

  Question.prototype.ensureLengthIsProper = function (answer) {
    var threshold = 0.8;
    return function (possibleAnswer) {
      var b = possibleAnswer.replace(delim.open, '').replace(delim.close, '');
      return (answer.length / b.length) >= threshold;
    };
  };

  Question.prototype.compareGrammarElementToAnswers = function (answer) {
    var b = this.getPossibleAnswers();
    if (!answer) {
      return false;
    }
    //This regex will only work for one occurence of {hey grammar element}
    //It needs to be changed for when the grammar elements are more than one
    //per body line.
    var reg = new RegExp(delim.open + '(.*)' + delim.close, 'g');
    //[0]original string [1-n]substring matches
    var results = reg.exec(b);
    var grammarElements = _.rest(results);

    return _.every(grammarElements, function (element) {
      var r = new RegExp('(^|\\W{1,1})' + element + '(\\W{1,1}|$)', 'g');
      return answer.search(r) !== -1;
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
      this.status = Question.ResponseStatus.TYPING_ERROR_NON_STRICT;
    } else {
      this.status = Question.ResponseStatus.INCORRECT;
    }

    if (this.attempts) {
      this.attempts++;
    } else {
      this.attempts = 1;
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
