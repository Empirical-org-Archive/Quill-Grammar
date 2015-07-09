describe('', function() {
  beforeEach(module('quill-grammar.play.sentences'));

  var sandbox,
      ctrl,
      scope,
      fakeFinalizeService,
      $q,
      stateSpy,
      $rootScope,
      $state;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    fakeFinalizeService = sandbox.stub();

    inject(function($controller, _$rootScope_, _$q_, _$state_) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      scope = $rootScope.$new();
      stateSpy = sandbox.stub($state, 'go');
      ctrl = $controller('SentencePlayCtrl',
                         { $scope: scope,
                           finalizeService: fakeFinalizeService });
      $q = _$q_;
    });
  });

  afterEach(function() {
    sandbox.verifyAndRestore();
  });

  describe('#finish', function() {
    beforeEach(function() {
      fakeFinalizeService.returns($q.when());
    });

    describe('with a session ID', function() {
      var fakeSessionId = 'fake-session-id';

      beforeEach(function() {
        scope.sessionId = fakeSessionId;
      });

      it('calls the Finalize service', function(done) {
        scope.finish().then(done);
        $rootScope.$apply();
        expect(stateSpy.calledOne).to.be.true;
      });

      it('transitions to the .results state with the session ID', function(done) {
        scope.finish().then(done);
        $rootScope.$apply();
        expect(stateSpy).to.have.been.calledWith('.results', {student: fakeSessionId});
      });
    });

    describe('with a passage ID', function() {

      beforeEach(function() {
        $state.params.passageId = 'fake-passage-id';
      });

      it('transitions to the .results state with the passage ID', function(done) {
        scope.finish().then(done);
        $rootScope.$apply();
        expect(stateSpy).to.have.been.calledWith('.results', {
          partnerIframe: true,
          passageId: 'fake-passage-id'
        });
      });
    });
  });
});
