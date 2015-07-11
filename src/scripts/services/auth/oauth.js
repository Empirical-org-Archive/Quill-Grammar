'use strict';

/*@ngInject*/
module.exports = function (empiricalBaseURL, oauthClientId, AccessToken, Endpoint, $state) {
  function authenticate() {
    AccessToken.set();
    if (!AccessToken.get()) {
      var redirectUri = $state.href($state.current.name, $state.params, {absolute: true});
      var endpointParams = {
        authorizePath: 'oauth/authorize',
        site: empiricalBaseURL.replace(/api\/v1\/?/, ''),
        clientId: oauthClientId,
        redirectUri: redirectUri,
        responseType: 'token'
      };
      Endpoint.redirect(endpointParams);
    }
  }
  function expireToken() {
    AccessToken.destroy();
  }

  return {
    authenticate: authenticate,
    expire: expireToken
  };
};
