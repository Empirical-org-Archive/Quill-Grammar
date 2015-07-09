'use strict';

/*@ngInject*/
module.exports = function (empiricalBaseURL, oauthClientId, oauthRedirectUri, AccessToken, Endpoint, Storage) {
  var endpointParams = {
    authorizePath: 'oauth/authorize',
    site: empiricalBaseURL.replace('/api/v1', ''),
    clientId: oauthClientId,
    redirectUri: oauthRedirectUri,
    responseType: 'token'
  };

  function cacheState(state) {
    Storage.set('originalState', state);
    console.log('caching state');
  }

  function authenticate(originalState) {
    AccessToken.set();
    if (!AccessToken.get()) {
      cacheState(originalState);
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
