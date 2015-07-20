'use strict';

module.exports =
angular.module('services.auth', [
  'firebase',
  'oauth',
  'ui.router',
  'LocalStorageModule',
  require('../../../../.tmp/config').name,
])
.config(require('./config.js'))
.factory('QuillFirebaseAuthService', require('./firebase.js'))
.factory('QuillOAuthService', require('./oauth.js'));
