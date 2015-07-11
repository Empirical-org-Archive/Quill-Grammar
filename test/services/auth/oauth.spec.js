'use strict';

describe('oauth service', function () {
  beforeEach(module('services.auth'));

  var oauthService,
      accessTokenService,
      sandbox,
      redirectSpy,
      $state;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    module(function ($provide, $stateProvider) {
      $provide.constant('empiricalBaseURL', 'http://foo.bar/api/v1/');
      $provide.constant('oauthClientId', 'baz');
      $stateProvider
        .state('play-sw', {
          controller: function () {},
          url: '/play/sw?uid&student'
        });
    });

    inject(function (QuillOAuthService, AccessToken, Endpoint, _$state_) {
      oauthService = QuillOAuthService;
      accessTokenService = AccessToken;
      $state = _$state_;
      redirectSpy = Endpoint.redirect = sandbox.spy();
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

  describe('authenticate', function () {
    it('sets the redirect URI to the current state + params', function () {
      $state.current = {
        name: 'play-sw'
      };
      $state.params = {
        uid: 'foo',
        student: 'bar'
      };

      oauthService.authenticate();
      expect(redirectSpy).to.have.been.calledWith({
        authorizePath: 'oauth/authorize',
        site: 'http://foo.bar/',
        clientId: 'baz',
        redirectUri: 'http://server/#/play/sw?uid=foo&student=bar', // 'server' becomes the host magically somehow.
        responseType: 'token'
      });
    });
  });
});
