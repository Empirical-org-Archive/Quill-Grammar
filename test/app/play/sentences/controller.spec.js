/* jshint expr:true */
'use strict';

describe('SentencePlayCtrl', function () {
  beforeEach(module('quill-grammar.play.sentences'));

  var sandbox,
      scope,
      fakeFinalizeService,
      conceptResultService,
      $controller,
      $q,
      $rootScope,
      $timeout,
      $state,
      stateSpy,
      analyticsSpy,
      localStorageSpy,
      GrammarActivity,
      loadActivitySpy,
      fakeGrammarActivity,
      fakeGrammarActivityId;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    fakeFinalizeService = sandbox.stub();

    inject(function (_$controller_, _$rootScope_, _$q_, _$state_, _$timeout_,
      AnalyticsService, SentenceLocalStorage, ConceptResult, _GrammarActivity_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $state = _$state_;
      $timeout = _$timeout_;
      conceptResultService = ConceptResult;
      GrammarActivity = _GrammarActivity_;
      scope = $rootScope.$new();
      stateSpy = sandbox.stub($state, 'go');
      localStorageSpy = sandbox.stub(SentenceLocalStorage, 'saveResults');
      analyticsSpy = sandbox.stub(AnalyticsService, 'trackSentenceWritingSubmission');
      loadActivitySpy = sandbox.stub(GrammarActivity, 'getById');
      $q = _$q_;
    });

    // FIXME: As part of the migration to the new data format #148,
    // the structure of this fake activity should be changed to match
    // the new data format. Failing tests will point to areas that
    // need fixing.
    fakeGrammarActivity = new GrammarActivity({
      rules: [
        {
          quantity: 1,
          ruleId: 123
        },
        {
          quantity: 2,
          ruleId: 456
        }
      ]
    });

    $state.params.ids = '1,2,3';
    fakeGrammarActivityId = 'abcdef123';
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  function subject() {
    $controller('SentencePlayCtrl',
      {$scope: scope,
      finalizeService: fakeFinalizeService,
      GrammarActivity: GrammarActivity});
  }

  describe('initialize', function () {
    describe('when the user loads a specific activity', function () {
      beforeEach(function () {
        $state.params.uid = fakeGrammarActivityId;
      });

      it('loads the grammar activity from firebase', function () {
        loadActivitySpy.returns($q.when(fakeGrammarActivity));
        subject();
        $rootScope.$digest();
        expect(loadActivitySpy).to.have.been.calledWith(fakeGrammarActivityId);
        expect(scope.grammarActivity).to.deep.equal(fakeGrammarActivity);
      });
    });

    describe('when the app generates a custom activity based on results from the passage', function () {
      beforeEach(function () {
        $state.params.ids = 'abcdef,ghijkl,12345';
        $state.params.passageId = 'fake-passage-id';
      });

      it('creates a custom grammar activity', function () {
        var customActivityWithRules = {
          rules: [
            {
              quantity: 3,
              ruleId: 'abcdef'
            },
            {
              quantity: 3,
              ruleId: 'ghijkl'
            },
            {
              quantity: 3,
              ruleId: '12345'
            }
          ]
        };
        subject();
        $rootScope.$digest();
        expect(scope.grammarActivity.rules[0]).to.deep.equal(customActivityWithRules.rules[0]);
        expect(scope.grammarActivity.passageId).to.equal('fake-passage-id');
      });
    });
  });

  // FIXME: This event should go away in favor of just maintaining
  // current rule/question state on the grammarActivity and calling
  // nextQuestion() on the activity to move forward.
  //
  // This is here until that behavior gets fixed.
  describe('currentRuleQuestion watcher', function () {
    it('updates the current rule', function () {
      subject();
      $rootScope.$digest();
      scope.grammarActivity = {
        rulesWithSelectedQuestions: [
          {
            title: 'not this one'
          },
          {
            title: 'select this one'
          }
        ]
      };

      scope.currentRuleQuestion = {
        ruleIndex: 1
      };
      $rootScope.$digest();
      expect(scope.currentRule.title).to.equal('select this one');
    });
  });

  describe('#finish', function () {
    beforeEach(function () {
      subject();
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
