/* jshint expr:true */
'use strict';

describe('SentencePlayCtrl', function () {
  beforeEach(module('quill-grammar.play.proofreadings'));

  var sandbox,
      ctrl,
      scope,
      $controller,
      $rootScope,
      $q,
      $state,
      getActivitySpy,
      fakeActivity,
      fakeStateParams,
      proofreaderActivity;

  beforeEach(function () {
    fakeActivity = {
      passage: 'foo'
    };

    fakeStateParams = {
      uid: 'abc123'
    };

    sandbox = sinon.sandbox.create();

    inject(function (_$controller_, _$rootScope_, ProofreaderActivity, _$q_, _$state_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $state = _$state_;
      $state.params = fakeStateParams;
      scope = $rootScope.$new();
      proofreaderActivity = ProofreaderActivity;
    });

    sandbox.mock(proofreaderActivity)
           .expects('getById')
           .withArgs(fakeStateParams.uid)
           .returns($q.when(fakeActivity));
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  function subject() {
    ctrl = $controller('ProofreadingPlayCtrl',
      {$scope: scope,
       ProofreaderActivity: proofreaderActivity,
       $state: $state});
    $rootScope.$apply(); // Resolve any promises kicked off on initialization.
  }

  describe('initialization', function () {
    it('loads the activity', function () {
      subject();
      expect(scope.proofreadingPassage).to.be.ok;
      expect(scope.proofreadingActivity).to.be.ok;
    });
  });

  describe('#submitPassage', function () {
    it('submits the passage', function () {
      subject();
      scope.submitPassage();
      $rootScope.$apply();
    });
  });
});
