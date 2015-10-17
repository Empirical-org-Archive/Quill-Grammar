'use strict';

module.exports =

/*@ngInject*/
function (QuillFirebaseAuthService, QuillOAuthService, $rootScope) {
  // Turn off the loading spinner.
  angular.element(document.getElementsByClassName('loading-spinner'))
    .css('display', 'none');

  // Always authenticate with Firebase.
  QuillFirebaseAuthService.authenticate();

  $rootScope.$on('$stateChangeStart', function (event, state, params) {
    if (state.data && state.data.authenticateUser) {
      var isAnonymous = ('anonymous' in params) && params.anonymous === 'true';
      if (!isAnonymous) {
        QuillOAuthService.watchForExpiration(state, params);
        if (!QuillOAuthService.isAuthenticated()) {
          QuillOAuthService.authenticate(state, params);
        }
      }
    }
  });
};
