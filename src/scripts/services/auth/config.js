'use strict';

module.exports =

/*@ngInject*/
function ($httpProvider, $stateProvider) {
  $httpProvider.interceptors.push(require('./oauth_interceptor.js'));

  $stateProvider.state('access_token', {
    url: '/access_token={accessToken}&token_type={tokenType}&expires_in={expiresIn}',
    template: '',
    controller: function ($stateParams, AccessToken, $location, $state, Storage) {
      var hashStr = [
        'access_token=' + $stateParams.accessToken,
        'token_type=' + $stateParams.tokenType,
        'expires_in=' + $stateParams.expiresIn
      ].join('&');
      AccessToken.setTokenFromString(hashStr);
      var postAuthenticationRedirect = Storage.delete('postAuthenticationRedirect');
      if (postAuthenticationRedirect === undefined) {
        parent.postMessage({action: 'message'}, 'https://www.quill.org');
        parent.postMessage({action: 'message'}, 'http://localhost:3000');
      } else {
        $state.go(postAuthenticationRedirect.stateName, postAuthenticationRedirect.stateParams);
      }
    }
  });
};
