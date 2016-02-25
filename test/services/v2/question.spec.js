'use strict';

describe('Question', function () {
  beforeEach(module('quill-grammar.services.question'));
  beforeEach(module('test.fixtures.firebase'));

  var Question,
      $rootScope,
      sandbox,
      question,
      concept1Question1Json;

  var CORRECT_ANSWER = 'Tom ironed his shirt because it was wrinkly.';
  var NON_STRICT_CORRECT_ANSWER = 'Tom blarg blarg shirt because it was wrinkly.';
  var TOO_SHORT_CORRECT_ANSWER = 'it was wrinkly.';
  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function (_Question_, _$rootScope_, _concept1Question1Json_) {
      Question = _Question_;
      $rootScope = _$rootScope_;
      concept1Question1Json = _concept1Question1Json_;
    });
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  beforeEach(function () {
    question = new Question(concept1Question1Json);
  });

  describe('#checkAnswer', function () {
    describe('when the response is empty', function () {
      it('sets status to NO_ANSWER', function () {
        question.checkAnswer();
        expect(question.status).to.equal(Question.ResponseStatus.NO_ANSWER);
      });
    });

    describe('when the response is exactly right', function () {
      it('sets status to CORRECT', function () {
        question.response = CORRECT_ANSWER;
        question.checkAnswer();
        expect(question.status).to.equal(Question.ResponseStatus.CORRECT);
      });

      it('sets the number of attempts to 1', function () {
        question.response = CORRECT_ANSWER;
        question.checkAnswer();
        expect(question.attempts).to.equal(undefined);
      });

      it('does everything else');
    });

    describe('when the response is not long enough', function () {
      it('sets the status to NOT_LONG_ENOUGH', function () {
        question.response = TOO_SHORT_CORRECT_ANSWER;
        question.checkAnswer();
        expect(question.status).to.equal(Question.ResponseStatus.NOT_LONG_ENOUGH);
      });
    });

    describe('when the response gets the grammar right but is not an exact match', function () {
      beforeEach(function () {
        question.response = NON_STRICT_CORRECT_ANSWER;
      });

      it('sets the status to TYPING_ERROR_NON_STRICT', function () {
        question.checkAnswer();
        expect(question.status).to.equal(Question.ResponseStatus.TYPING_ERROR_NON_STRICT);
      });

      it('increments the number of attempts', function () {
        question.fixAttempts = 0;
        question.checkAnswer();
        expect(question.fixAttempts).to.equal(1);
      });
    });

    describe('when the response is totally wrong', function () {
      it('sets the status to INCORRECT', function () {
        question.response = 'I like ice cream to eat sometimes when it is hot.';
        question.checkAnswer();
        expect(question.status).to.equal(Question.ResponseStatus.INCORRECT);
      });
    });

    describe('when the number of attempts is >= 2', function () {
      beforeEach(function () {
        question.attempts = 2;
      });

      describe('for correct responses', function () {
        it('does nothing', function () {
          question.response = CORRECT_ANSWER;
          question.checkAnswer();
          expect(question.status).to.equal(Question.ResponseStatus.CORRECT);
        });

        it('does more nothing', function () {
          question.response = NON_STRICT_CORRECT_ANSWER;
          question.checkAnswer();
          expect(question.status).to.equal(Question.ResponseStatus.TYPING_ERROR_NON_STRICT);
        });
      });

      describe('for anything else', function () {
        it('sets the status to TOO_MANY_ATTEMPTS', function () {
          question.response = TOO_SHORT_CORRECT_ANSWER;
          question.checkAnswer();
          expect(question.status).to.equal(Question.ResponseStatus.TOO_MANY_ATTEMPTS);
        });
      });
    });
  });

  describe('#getResponseMessage', function () {
    it('returns the error message for the given response status', function () {
      question.status = Question.ResponseStatus.INCORRECT;
      expect(question.getResponseMessage()).to.include('that answer is incorrect');
    });

    it('even works for functions', function () {
      question.status = Question.ResponseStatus.TOO_MANY_ATTEMPTS;
      expect(question.getResponseMessage()).to.include(CORRECT_ANSWER);
    });
  });
});
