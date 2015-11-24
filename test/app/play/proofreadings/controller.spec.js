/* jshint expr:true */
'use strict';

describe('ProofreadingPlayCtrl', function () {
  beforeEach(module('quill-grammar.play.proofreadings'));
  beforeEach(module('test.fixtures.firebase'));
  beforeEach(module('empirical-angular'));

  var scope,
      sandbox,
      $controller,
      $rootScope,
      $q,
      $state,
      $timeout,
      $window,
      ProofreaderActivity,
      ConceptsFBService,
      proofreaderActivity1Id,
      TypingSpeed;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function (_$controller_, _$rootScope_, _ProofreaderActivity_,
      _$q_, _$state_, _$timeout_, setupMockFirebaseData, _proofreaderActivity1Id_,
      _ConceptsFBService_, _$window_, _TypingSpeed_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $state = _$state_;
      $timeout = _$timeout_;
      $window = _$window_;
      TypingSpeed = _TypingSpeed_;
      proofreaderActivity1Id = _proofreaderActivity1Id_;
      scope = $rootScope.$new();
      ProofreaderActivity = _ProofreaderActivity_;
      ConceptsFBService = _ConceptsFBService_;
      setupMockFirebaseData();
    });
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  function subject() {
    $controller('ProofreadingPlayCtrl',
      {$scope: scope,
       $state: $state});
  }

  function resolveInitPromises() {
    ProofreaderActivity.ref.flush();
    $rootScope.$apply(); // Resolve any promises kicked off on initialization.
    ConceptsFBService.ref.flush();
    $rootScope.$apply();
  }

  describe('initialization', function () {
    describe('when the activity exists', function () {
      beforeEach(function () {
        $state.params = {
          uid: proofreaderActivity1Id
        };
      });

      it('loads the activity', function () {
        subject();
        resolveInitPromises();

        expect(scope.proofreadingPassage).to.be.ok;
        expect(scope.proofreadingActivity).to.be.ok;
      });
    });

    describe('when the activity does not exist', function () {
      beforeEach(function () {
        $state.params = {
          uid: 'garbage-nonexistent-id'
        };
        $window.alert = sandbox.spy();
      });

      it('does not load a passage', function () {
        subject();
        ProofreaderActivity.ref.flush();
        $rootScope.$apply();
        expect(scope.proofreadingPassage).not.to.be.ok;
      });

      // it('alerts an error to the user', function () {
      //   subject();
      //   ProofreaderActivity.ref.flush();
      //   $rootScope.$apply();
      //   expect($window.alert).to.have.been.called;
      // });
    });
  });

  describe('#submitPassage', function () {
    beforeEach(function () {
      // Set up state params because we need to load a passage.
      $state.params = {
        uid: proofreaderActivity1Id
      };
    });

    it('submits the passage', function () {
      subject();
      resolveInitPromises();

      scope.submitPassage();
      $rootScope.$apply();
    });
  });
});
