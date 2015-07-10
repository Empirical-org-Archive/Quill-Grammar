describe('QuillFirebaseAuthService', function() {
  beforeEach(module('services.auth'));

  var sandbox, quillFirebaseAuthService, $q, $firebaseAuth, authSpy, $httpBackend, fakeAuthObj, authWithCustomTokenSpy;
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    onAuthSpy = sandbox.spy();
    authWithCustomTokenSpy = sandbox.stub()
    fakeAuthObj = {
      $onAuth: onAuthSpy,
      $authWithCustomToken: authWithCustomTokenSpy
    };
    var fakeEmpiricalBaseUrl = 'http://foo.bar';
    var fakeFirebaseApp = 'foo-bar';
    authSpy = sandbox.stub().returns(fakeAuthObj);
    module(function($provide) {
      $provide.value('$firebaseAuth', authSpy);
      $provide.constant('empiricalBaseUrl', fakeEmpiricalBaseUrl);
      $provide.constant('firebaseApp', fakeFirebaseApp);
    });

    inject(function(QuillFirebaseAuthService, _$q_, _$firebaseAuth_, _$httpBackend_) {
      quillFirebaseAuthService = QuillFirebaseAuthService;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
    });

    authWithCustomTokenSpy.returns($q.when()); // returns a promise

    // HTTP request for the token
    $httpBackend.when('POST', 'firebase_tokens?app=foo-bar')
                .respond('garbaggeee');
  });

  afterEach(function() {
    sandbox.verifyAndRestore();
  });

  describe('#authenticate', function() {
    it('returns a promise', function(done) {
      quillFirebaseAuthService.authenticate().then(done);
      $httpBackend.flush();
    });
  });
});
