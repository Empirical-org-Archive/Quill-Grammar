/* jshint expr:true */
'use strict';

describe('SentencePlayCtrl', function () {
  beforeEach(module('quill-grammar.play.sentences'));

  var sandbox,
      ctrl,
      scope,
      fakeFinalizeService,
      conceptResultService,
      $q,
      $rootScope,
      $timeout,
      $state,
      stateSpy,
      analyticsSpy,
      localStorageSpy;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    fakeFinalizeService = sandbox.stub();

    inject(function ($controller, _$rootScope_, _$q_, _$state_, _$timeout_, AnalyticsService, SentenceLocalStorage, ConceptResult) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $timeout = _$timeout_;
      conceptResultService = ConceptResult;
      scope = $rootScope.$new();
      stateSpy = sandbox.stub($state, 'go');
      localStorageSpy = sandbox.stub(SentenceLocalStorage, 'saveResults');
      analyticsSpy = sandbox.stub(AnalyticsService, 'trackSentenceWritingSubmission');
      ctrl = $controller('SentencePlayCtrl',
                         {$scope: scope,
                          finalizeService: fakeFinalizeService});
      $q = _$q_;
    });
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  describe('answerRuleQuestion event', function () {
    var conceptResultSaveSpy;
    beforeEach(function () {
      conceptResultSaveSpy = sandbox.stub(conceptResultService, 'saveToFirebase');
      $state.params.passageId = 'fake-passage-id';
    });

    describe('when the student is not anonymous', function () {
      beforeEach(function () {
        scope.sessionId = 'fake-session-id';
      });

      it('saves concept results to firebase', function () {
        var ruleQuestion = {
          conceptUid: 'abcde12345'
        };
        var answer = 'gooble gobble';
        var isCorrect = true;

        $rootScope.$broadcast('answerRuleQuestion', ruleQuestion, answer, isCorrect);
        expect(conceptResultSaveSpy).to.have.been.calledWith(scope.sessionId, ruleQuestion.conceptUid, {
          answer: answer,
          correct: 1
        });
      });
    });
  });

  describe('#finish', function () {
    beforeEach(function () {
      fakeFinalizeService.returns($q.when());
    });

    it('redirects to the .results state', function (done) {
      $state.params.student = 'foobar';
      scope.finish().then(function () {
        expect(stateSpy).to.have.been.calledWith('.results', {
          student: 'foobar'
        });
        done();
      });
      $rootScope.$apply();
    });

    describe('with a session ID', function () {
      var fakeSessionId = 'fake-session-id';

      beforeEach(function () {
        scope.sessionId = fakeSessionId;
      });

      it('calls the Finalize service', function (done) {
        scope.finish().then(function () {
          expect(fakeFinalizeService).to.have.been.calledOnce;
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('when pfAllCorrect is true', function () {
      var fakeSessionId = 'fake-session-id';

      beforeEach(function () {
        scope.sessionId = fakeSessionId;
        $state.params.pfAllCorrect = true;
      });

      it('calls the Finalize service without calling $scope.finish', function (done) {
        scope.checkIfAllPfCorrect().then(function () {
          expect(fakeFinalizeService).to.have.been.calledOnce;
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('with a passage ID', function () {
      beforeEach(function () {
        $state.params.passageId = 'fake-passage-id';
      });

      it('sends the analytics event along with the stored results', function (done) {
        localStorageSpy.returns('foobar'); // fake results
        scope.finish().then(function () {
          expect(analyticsSpy).to.have.been.calledWith('foobar', 'fake-passage-id');
          done();
        });
        $rootScope.$apply();
      });
    });
  });
});
