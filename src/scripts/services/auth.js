'use strict';

module.exports =
angular.module('services.auth', [
  'firebase'
])

.factory('FirebaseLmsAuthService', function ($firebaseAuth, empiricalBaseURL, $http, localStorageService, $q) {
  var firebaseTokenUrl = empiricalBaseURL + 'firebase_tokens?app=quill-grammar-staging';

  function fetchToken() {
    return $http.post(firebaseTokenUrl).then(function(response) {
      return response.data.token;
    });
  }

  function storeAuthData(authData) {
    localStorageService.set('authData', authData);
  }

  // Return data via promise.
  function getCachedAuthData() {
    var d = $q.defer();
    d.resolve(localStorageService.get('authData'));
    return d.promise;
  }

  return {
    authenticate: function(ref) {
      return getCachedAuthData().then(function(authData) {
        if (!authData) {
          console.log('cache miss');
          return fetchToken().then(function(token) {
            var authObj = $firebaseAuth(ref);
            return authObj.$authWithCustomToken(token);
          }).then(function(authData) {
            storeAuthData(authData);
            return authData;
          });
        }
        console.log('cache hit');
        return authData;
      });

    }
  }
});
