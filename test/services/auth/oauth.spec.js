describe('', function() {
  beforeEach(module('services.auth'));

  var oauthService, accessTokenService, sandbox;
  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function(QuillOAuthService, AccessToken) {
      oauthService = QuillOAuthService;
      accessTokenService = AccessToken;
    });
  });

  afterEach(function() {
    sandbox.verifyAndRestore();
  });

  describe('expire', function() {
    it('expires the token', function() {
      sandbox.mock(accessTokenService).expects('destroy').once();
      oauthService.expire();
    });
  });
});
