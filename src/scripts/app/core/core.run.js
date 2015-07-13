'use strict';

module.exports =

/*@ngInject*/
function (QuillFirebaseAuthService, QuillOAuthService, $rootScope) {
  // Always authenticate with Firebase.
  QuillFirebaseAuthService.authenticate();

  $rootScope.$on('$stateChangeStart', function (event, state, params) {
    if (state.data && state.data.authenticateUser) {
      if (!QuillOAuthService.isAuthenticated()) {
        QuillOAuthService.authenticate(state, params);
      }
    }
  });
};
