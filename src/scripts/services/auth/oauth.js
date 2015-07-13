'use strict';

/*@ngInject*/
module.exports = function (empiricalBaseURL, oauthClientId, AccessToken, Endpoint, $state, Storage) {
  function isAuthenticated() {
    AccessToken.set();
    return !!AccessToken.get();
  }

  // Need to pass in state + params as arguments because
  // these are apparently not injectable at the point in the app
  // lifecycle at which authenticate() runs.
  function authenticate(currentState, currentStateParams) {
    // When the whole flow is done, we should land back at the original state.

    // Cache the state name + params into storage so that we can redirect
    // when the OAuth flow succeeds.
    Storage.set('postAuthenticationRedirect', {
      stateName: currentState.name,
      stateParams: currentStateParams
    });
    var redirectUri = $state.href('index', {}, {absolute: true});

    var endpointParams = {
      authorizePath: 'oauth/authorize',
      site: empiricalBaseURL.replace(/api\/v1\/?/, ''),
      clientId: oauthClientId,
      redirectUri: redirectUri,
      responseType: 'token'
    };
    Endpoint.redirect(endpointParams);
  }
  function expireToken() {
    AccessToken.destroy();
  }

  return {
    isAuthenticated: isAuthenticated,
    authenticate: authenticate,
    expire: expireToken
  };
};
