'use strict';

describe('QuillFirebaseAuthService', function () {
  beforeEach(module('services.auth'));

  var sandbox,
      quillFirebaseAuthService,
      $q,
      authSpy,
      $httpBackend,
      fakeAuthObj,
      authWithCustomTokenSpy,
      onAuthSpy;

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
      $provide.constant('empiricalBaseURL', 'http://foo.bar');
      $provide.constant('firebaseApp', fakeFirebaseApp);
    });

    inject(function (QuillFirebaseAuthService, _$q_, _$httpBackend_) {
      quillFirebaseAuthService = QuillFirebaseAuthService;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
    });

    authWithCustomTokenSpy.returns($q.when()); // returns a promise

    // HTTP request for the token
    $httpBackend.when('POST', /firebase_tokens\?app=/)
                .respond({token: 'foobar'});
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  describe('#authenticate', function () {
    it('returns a promise', function (done) {
      quillFirebaseAuthService.authenticate().then(done);
      $httpBackend.flush();
    });
  });
});
