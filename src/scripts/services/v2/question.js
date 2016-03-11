'use strict';
var JsDiff = require('diff')
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
  var self = this;
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

  function applyDiff(answer, response, theirs) {
    console.log(answer, response, theirs)
    var diff = JsDiff.diffWords(response, answer);
    if (theirs === "true") {
      console.log("true")
      var spans = diff.map(function(part){
        // green for additions, red for deletions
        // grey for common parts
        var weight = part.removed ? 'bold' : 'regular';
        var decoration = part.removed ? 'underline' : 'none';
        var display =  part.added ? 'none' : '';
        var span = "<span style='display: " + display + "; font-weight: " + weight + "; text-decoration: " + decoration + "' >" + part.value + "</span>"
        return span;
      });
    } else {
      console.log("false")
      var spans = diff.map(function(part){
        // green for additions, red for deletions
        // grey for common parts
        var weight = part.added ? 'bold' : 'regular';
        var decoration = part.added ? 'underline' : 'none';
        var display = part.removed ? 'none' : '';

        var span = "<span style='display: " + display + "; font-weight: " + weight + "; text-decoration: " + decoration + "' >" + part.value + "</span>"
        return span;
      });
    }



    console.log("Spans: ", spans.join(''))
    return spans.join('')
  }

  function getCorrectString(b, response, theirs) {
    var answers = _.chain(b)
      .map(removeDelimeters)
      .value();
    console.log("Anwers: ", answers);
    answers = _.map(answers, function(b) {
      return applyDiff(b, response, theirs)
    })
    return '<ul><li>' + answers.join('</li><li>') + '</ul>';
  }

  Question.ResponseMessages = {};
  Question.ResponseMessages[Question.ResponseStatus.DEFAULT] = 'Check Work';
  Question.ResponseMessages[Question.ResponseStatus.NOT_LONG_ENOUGH] = '<b>Try again!</b> Your answer is not long enough.';
  Question.ResponseMessages[Question.ResponseStatus.INCORRECT] = '<b>Try Again!</b> Unfortunately, that answer is incorrect.';
  Question.ResponseMessages[Question.ResponseStatus.TYPING_ERROR_NON_STRICT] = 'You are correct, but you have some typing errors. Please correct them to continue.';
  Question.ResponseMessages[Question.ResponseStatus.TYPING_ERROR_NON_STRICT_UNFIXED] = 'You are correct, but you have some typing errors. You may correct them or continue.';
  Question.ResponseMessages[Question.ResponseStatus.TOO_MANY_ATTEMPTS] = function (question) {
    return '<b>Incorrect.</b> Your response: ' + getCorrectString(_.pluck(question.answers, 'text'), question.response, "true") + 'Correct response: ' + getCorrectString(_.pluck(question.answers, 'text'), question.response, "false");
  };
  Question.ResponseMessages[Question.ResponseStatus.CORRECT] = '<b>Well done!</b> That\'s the correct answer.';
  Question.ResponseMessages[Question.ResponseStatus.NO_ANSWER] = 'You must enter a sentence for us to check.';

  function normalize(text) {
    return text.replace(/[\u2018\u2019]/g, '\u0027').replace(/[\u201C\u201D]/g, '\u0022').replace('‚', ',');
  }

  function compareEntireAnswerToAnswers(answer) {
    return function (b) {
      var cleaned = removeDelimeters(b);
      return normalize(answer) === normalize(cleaned);
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
        var r = new RegExp('(^|\\W{1,1})' + normalize(element) + '(\\W{1,1}|$)', 'g');
        return normalize(answer).search(r) !== -1;
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
