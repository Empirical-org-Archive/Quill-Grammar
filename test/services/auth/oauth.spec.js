'use strict';

describe('oauth service', function () {
  beforeEach(module('services.auth'));

  var oauthService,
      accessTokenService,
      sandbox,
      redirectSpy,
      storageSpy,
      $state;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    module(function ($provide, $stateProvider) {
      $provide.constant('empiricalBaseURL', 'http://foo.bar/api/v1/');
      $provide.constant('oauthClientId', 'baz');
      $stateProvider
        .state('index', {
          controller: function () {},
          url: '/foo/bar'
        });
    });

    inject(function (QuillOAuthService, AccessToken, Endpoint, _$state_, Storage) {
      oauthService = QuillOAuthService;
      accessTokenService = AccessToken;
      $state = _$state_;
      redirectSpy = Endpoint.redirect = sandbox.spy();
      storageSpy = Storage.set = sandbox.spy();
    });
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  describe('expire', function () {
    it('expires the token', function () {
      sandbox.mock(accessTokenService).expects('destroy').once();
      oauthService.expire();
    });
  });

  describe('isAuthenticated', function () {
    beforeEach(function () {
      sandbox.mock(accessTokenService).expects('set').once();
    });

    context('when the token has been set', function () {
      beforeEach(function () {
        sandbox.mock(accessTokenService).expects('get').once().returns('a-fake-token');
      });

      it('returns true', function () {
        expect(oauthService.isAuthenticated()).to.equal(true);
      });
    });

    context('when the token has not been set previously', function () {
      beforeEach(function () {
        sandbox.mock(accessTokenService).expects('get').once().returns(null);
      });

      it('returns false', function () {
        expect(oauthService.isAuthenticated()).to.equal(false);
      });
    });
  });

  describe('authenticate', function () {
    it('stores the current state + params', function () {
      oauthService.authenticate({name: 'foobar'}, {student: 'baz'});
      expect(storageSpy).to.have.been.calledWith('postAuthenticationRedirect', {
        stateName: 'foobar',
        stateParams: {student: 'baz'}
      });
    });

    it('redirects to the LMS to do the OAuth handshake', function () {
      oauthService.authenticate({name: 'foobar'}, {student: 'baz'});
      expect(redirectSpy).to.have.been.calledWith({
        authorizePath: 'oauth/authorize',
        site: 'http://foo.bar/',
        clientId: 'baz',
        redirectUri: 'http://server/#/foo/bar', // 'server' becomes the host magically somehow.
        responseType: 'token'
      });
    });
  });
});
