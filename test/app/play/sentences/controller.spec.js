/* jshint expr:true */
'use strict';

describe('SentencePlayCtrl', function () {
  beforeEach(module('quill-grammar.play.sentences'));
  beforeEach(module('test.fixtures.firebase'));
  beforeEach(module('empirical-angular'));

  var sandbox,
      scope,
      fakeFinalizeService,
      $controller,
      $q,
      $rootScope,
      $state,
      stateSpy,
      analyticsSpy,
      localStorageSpy,
      GrammarActivity,
      grammarActivityJson, // Firebase fixture data.
      grammarActivity1Id;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    fakeFinalizeService = sandbox.stub();

    inject(function (_$controller_, _$rootScope_, _$q_, _$state_, _$timeout_,
      AnalyticsService, SentenceLocalStorage, ConceptResult, _GrammarActivity_,
      _grammarActivityJson_, _grammarActivity1Id_, setupMockFirebaseData) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $state = _$state_;
      GrammarActivity = _GrammarActivity_;
      scope = $rootScope.$new();
      stateSpy = sandbox.stub($state, 'go');
      localStorageSpy = sandbox.stub(SentenceLocalStorage, 'saveResults');
      analyticsSpy = sandbox.stub(AnalyticsService, 'trackSentenceWritingSubmission');
      grammarActivityJson = _grammarActivityJson_;
      $q = _$q_;
      setupMockFirebaseData();
      grammarActivity1Id = _grammarActivity1Id_;
    });
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
    var ConceptsFBService;
    beforeEach(inject(function (_ConceptsFBService_) {
      ConceptsFBService = _ConceptsFBService_;
    }));

    describe('when the user loads a specific activity', function () {
      beforeEach(function () {
        $state.params.uid = grammarActivity1Id;
      });

      it('loads the grammar activity from firebase', function () {
        subject();
        GrammarActivity.ref.flush();
        $rootScope.$digest();
        ConceptsFBService.ref.flush();
        $rootScope.$digest();
        expect(scope.grammarActivity).to.be.ok;
        expect(scope.grammarActivity.title).to.equal(grammarActivityJson.title);
      });
    });

    describe('when the app generates a custom activity based on results from the passage', function () {
      var concept1RuleNumber,
          concept1Json;

      beforeEach(inject(function (_concept1RuleNumber_, _concept1Json_) {
        concept1RuleNumber = _concept1RuleNumber_;
        concept1Json = _concept1Json_;
        $state.params.ids = '' + concept1RuleNumber; // Should be coming in as a string.
        $state.params.passageId = 'fake-passage-id';
      }));

      it('creates a custom grammar activity', function () {
        subject();
        ConceptsFBService.ref.flush();
        $rootScope.$digest();
        expect(scope.grammarActivity.concepts[0].concept_level_0.name).to.equal(concept1Json.concept_level_0.name);
        expect(scope.grammarActivity.passageId).to.equal('fake-passage-id');
      });
    });
  });

  describe('#finish', function () {
    beforeEach(function () {
      $state.params.ids = '1,2,3'; // Suppress initialization error.
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
