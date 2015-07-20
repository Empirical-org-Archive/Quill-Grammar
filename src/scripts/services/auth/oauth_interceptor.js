'use strict';

/*@ngInject*/
module.exports = function ($q, AccessToken) {
  return {
    request: function (config) {
      AccessToken.set();
      var token = AccessToken.get();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token.access_token;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    }
  };
};
