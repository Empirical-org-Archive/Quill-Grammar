'use strict';

/*@ngInject*/
module.exports = function($q, localStorageService) {
  function getOAuthToken() {
    return localStorageService.get('oauth_access_token');
  }

  return {
    'request': function(config) {
      var token = getOAuthToken();
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      } else {
        delete config.headers['Authorization'];
      }
      return config;
    }
  }
}
