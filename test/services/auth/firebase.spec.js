'use strict';

describe('QuillFirebaseAuthService', function () {
  beforeEach(module('services.auth'));

  var sandbox,
      quillFirebaseAuthService,
      $q,
      authSpy,
      $httpBackend,
      $rootScope,
      fakeAuthObj,
      authWithCustomTokenSpy,
      onAuthSpy,
      localStorageGetSpy,
      localStorageSetSpy;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    onAuthSpy = sandbox.spy();
    authWithCustomTokenSpy = sandbox.stub();
    fakeAuthObj = {
      $onAuth: onAuthSpy,
      $authWithCustomToken: authWithCustomTokenSpy
    };
    var fakeFirebaseApp = 'foo-bar';
    authSpy = sandbox.stub().returns(fakeAuthObj);
    module(function ($provide) {
      $provide.value('$firebaseAuth', authSpy);
      $provide.constant('empiricalBaseURL', 'http://foo.bar/api/v1/');
      $provide.constant('firebaseApp', fakeFirebaseApp);
    });

    inject(function (QuillFirebaseAuthService, _$q_, _$httpBackend_, localStorageService, _$rootScope_) {
      quillFirebaseAuthService = QuillFirebaseAuthService;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      localStorageGetSpy = sandbox.stub(localStorageService, 'get');
      localStorageSetSpy = sandbox.spy(localStorageService, 'set');
    });

  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  describe('#authenticate', function () {
    describe('when there is no cached firebase token', function() {
      beforeEach(function() {
        // HTTP request for the token
        $httpBackend.expectPOST('http://foo.bar/api/v1/firebase_tokens?app=foo-bar')
                    .respond({token: 'fake-token-from-lms'});

        // Stub only returns a promise when actually called with the token.
        authWithCustomTokenSpy.withArgs('fake-token-from-lms').returns($q.when()); // returns a promise
      });

      it('requests a firebase token from the LMS and authenticates with it', function(done) {
        quillFirebaseAuthService.authenticate().then(done);
        $httpBackend.flush();
      });

      it('caches the token for future requests', function(done) {
        quillFirebaseAuthService.authenticate().then(function() {
          expect(localStorageSetSpy).to.have.been.calledWith('token', 'fake-token-from-lms');
          done();
        });
        $httpBackend.flush();
      });
    });

    describe('when there is a cached firebase token', function() {
      beforeEach(function() {
        localStorageGetSpy.withArgs('token').returns('cached-fake-token');
        authWithCustomTokenSpy.withArgs('cached-fake-token').returns($q.when()); // returns a promise
      });

      it('retrieves the existing token from the cache', function(done) {
        quillFirebaseAuthService.authenticate().then(function(token) {
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('when the authentication status changes ($onAuth callback)', function() {
      describe('when the authentication expires (falsy argument to callback)', function() {
      });
    });
  });
});
