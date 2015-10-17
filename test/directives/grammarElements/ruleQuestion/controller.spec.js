/* jshint expr:true */
'use strict';

describe('GrammarRuleQuestionCtrl', function () {
  beforeEach(module('quill-grammar.directives.ruleQuestion'));
  beforeEach(module('test.fixtures.firebase'));

  var $rootScope,
      $controller,
      scope,
      Question,
      question,
      sandbox;

  beforeEach(inject(function (_$rootScope_,
    _$controller_, concept1Question1Json, _Question_) {
    sandbox = sinon.sandbox.create();
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    Question = _Question_;

    scope = $rootScope.$new();
    scope.question = question = new Question(concept1Question1Json);

    $controller('GrammarRuleQuestionCtrl', {
      $scope: scope
    });
    $rootScope.$digest();
  }));

  describe('#checkAnswer', function () {
    beforeEach(function () {
      sandbox.stub(question, 'checkAnswer');
      scope.submit = sandbox.spy();
    });

    it('sets the response message', function () {
      question.status = Question.ResponseStatus.NO_ANSWER;
      scope.checkAnswer();
      expect(scope.responseMessage).to.include('enter a sentence');
    });

    describe('no answer', function () {
      beforeEach(function () {
        question.status = Question.ResponseStatus.NO_ANSWER;
        scope.checkAnswer();
      });

      it('indicates the user should try again', function () {
        scope.checkAnswer();
        expect(scope.checkAnswerText).to.equal('Recheck Work');
        expect(scope.questionClass).to.equal('try_again');
      });
    });

    describe('correct answer', function () {
      beforeEach(function () {
        question.status = Question.ResponseStatus.CORRECT;
      });

      it('indicates the user was correct', function () {
        scope.checkAnswer();
        expect(scope.questionClass).to.equal('correct');
      });

      it('submits the answer', function () {
        scope.checkAnswer();
        expect(scope.submit).to.have.been.calledOnce;
      });
    });

    describe('non-strict correct answer', function () {
      beforeEach(function () {
        scope.submit = sandbox.spy();
        question.status = Question.ResponseStatus.CORRECT;
      });

      it('indicates the user was correct', function () {
        scope.checkAnswer();
        expect(scope.questionClass).to.equal('correct');
      });

      it('submits the answer', function () {
        scope.checkAnswer();
        expect(scope.submit).to.have.been.calledOnce;
      });
    });

    describe('too many attempts', function () {
      beforeEach(function () {
        question.status = Question.ResponseStatus.TOO_MANY_ATTEMPTS;
      });

      it('indicates the user was wrong', function () {
        scope.checkAnswer();
        expect(scope.questionClass).to.equal('incorrect');
      });

      it('does not let the user submit the answer again', function () {
        scope.checkAnswer();
        expect(scope.showCheckAnswerButton).to.be.false;
      });

      it('submits the answer', function () {
        scope.checkAnswer();
        expect(scope.submit).to.have.been.called;
      });
    });
  });
});
