'use strict';

var R = require('ramda');

/*@ngInject*/
module.exports = function ($firebaseAuth, firebaseApp, empiricalBaseURL, $http, localStorageService) {
  var firebaseTokenUrl = empiricalBaseURL + 'firebase_tokens?app=' + firebaseApp;
  var authObj, offAuth; // offAuth = handler for disabling

  function fetchToken() {
    console.log('fetching token');
    return $http.post(firebaseTokenUrl).then(function success (response) {
      return response.data.token;
    }, function error (response) {
      console.log('an error occurred while fetching the firebase token: ', response);
    });
  }

  function storeToken(token) {
    localStorageService.set('token', token);
  }

  function resetToken() {
    console.log('resetting the token');
    storeToken(null);
  }

  function getCached(prop) {
    return localStorageService.get(prop);
  }

  // If a token is not provided, fetch and store it.
  var maybeFetchToken = R.ifElse(R.not, R.pipeP(fetchToken, R.tap(storeToken)), R.identity);

  function firebaseAuthWithToken(token) {
    // authObj.$onAuth()
    return authObj.$authWithCustomToken(token).then(R.identity, handleErrors);
  }

  var fetchAndAuthWithToken = R.pipeP(maybeFetchToken, firebaseAuthWithToken);

  var resetAndFetch = R.pipeP(resetToken, fetchAndAuthWithToken);

  // If token is expired, try to re-fetch and auth again.
  var handleErrors = R.cond([R.propEq('code', 'EXPIRED_TOKEN'), resetAndFetch],
                            [R.propEq('code', 'INVALID_TOKEN'), resetAndFetch],
                            [R.T, R.identity]); // Fall through to error handlers further down the promise chain.

  var reAuthIfLoggedOut = R.ifElse(R.not, fetchAndAuthWithToken, R.identity);

  function authenticate(ref) {
    if (offAuth) {
      console.log('disabling auth callback');
      offAuth();
    }
    authObj = $firebaseAuth(ref);
    offAuth = authObj.$onAuth(reAuthIfLoggedOut);
    return fetchAndAuthWithToken(getCached('token'));
  }

  return {
    authenticate: authenticate
  };
};
