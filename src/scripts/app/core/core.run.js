'use strict';

module.exports =

/*@ngInject*/
function (QuillFirebaseAuthService, QuillOAuthService, $rootScope) {
  // Always authenticate with Firebase.
  QuillFirebaseAuthService.authenticate();

  $rootScope.$on('$stateChangeStart', function (event, state, params) {
    if (state.data && state.data.authenticateUser) {
      var isAnonymous = ('anonymous' in params) && params.anonymous === 'true';
      if (!isAnonymous && !QuillOAuthService.isAuthenticated()) {
        QuillOAuthService.authenticate(state, params);
      }
    }
  });
};
