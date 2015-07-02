'use strict';

/*@ngInject*/
module.exports = function(empiricalBaseURL, AccessToken, Endpoint, Storage) {

  var endpointParams = {
    authorizePath: 'oauth/authorize',
    site: empiricalBaseURL.replace('/api/v1', ''),
    clientId: 'd64dad998f15b369210884f6e6074af87bd58657757cf76f2c1d3e209a66d2bd',
    redirectUri: 'http://localhost:3001',
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

  return {
    authenticate: authenticate
  };
};
