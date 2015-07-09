'use strict';

module.exports =
angular.module('services.auth', [
  'firebase',
  'oauth',
  'ui.router',
  require('../../../../.tmp/config').name,
])
.config(require('./config.js'))
.factory('QuillFirebaseAuthService', require('./firebase.js'))
.factory('QuillOAuthService', require('./oauth.js'));
