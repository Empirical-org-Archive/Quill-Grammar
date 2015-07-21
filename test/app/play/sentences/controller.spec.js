'use strict';

describe('SentencePlayCtrl', function () {
  beforeEach(module('quill-grammar.play.sentences'));

  var sandbox,
      ctrl,
      scope,
      fakeFinalizeService,
      $q,
      $rootScope,
      $state,
      stateSpy,
      analyticsSpy,
      localStorageSpy;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    fakeFinalizeService = sandbox.stub();

    inject(function ($controller, _$rootScope_, _$q_, _$state_, AnalyticsService, SentenceLocalStorage) {
      $rootScope = _$rootScope_;
      $state = _$state_;
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
    beforeEach(function () {
      $state.params.passageId = 'fake-passage-id';
    });

    it('does things', function () {
      var ruleQuestion = {};
      var answer = 'gooble gobble';
      var isCorrect = true;

      $rootScope.$broadcast('answerRuleQuestion', ruleQuestion, answer, isCorrect);
    });
  });

  describe('#finish', function () {
    beforeEach(function () {
      fakeFinalizeService.returns($q.when());
    });

    describe('with a session ID', function () {
      var fakeSessionId = 'fake-session-id';

      beforeEach(function () {
        scope.sessionId = fakeSessionId;
      });

      it('calls the Finalize service', function (done) {
        scope.finish().then(done);
        $rootScope.$apply();
        expect(stateSpy.calledOne).to.be(true);
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
