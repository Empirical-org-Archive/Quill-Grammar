/* jshint expr:true */
'use strict';

describe('ProofreadingPlayCtrl', function () {
  beforeEach(module('quill-grammar.play.proofreadings'));
  beforeEach(module('test.fixtures.firebase'));

  var scope,
      $controller,
      $rootScope,
      $q,
      $state,
      ProofreaderActivity,
      proofreaderActivity1Id;

  beforeEach(function () {
    inject(function (_$controller_, _$rootScope_, _ProofreaderActivity_, _$q_, _$state_, setupMockFirebaseData, _proofreaderActivity1Id_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $state = _$state_;
      proofreaderActivity1Id = _proofreaderActivity1Id_;
      $state.params = {
        uid: proofreaderActivity1Id
      };
      scope = $rootScope.$new();
      ProofreaderActivity = _ProofreaderActivity_;
      setupMockFirebaseData();
    });
  });

  function subject() {
    $controller('ProofreadingPlayCtrl',
      {$scope: scope,
       $state: $state});
    ProofreaderActivity.ref.flush();
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
