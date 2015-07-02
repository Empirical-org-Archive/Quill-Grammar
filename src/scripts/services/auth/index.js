'use strict';

module.exports =
angular.module('services.auth', [
  'firebase',
  'oauth'
])
.config(require('./config.js'))
.factory('QuillFirebaseAuthService', require('./firebase.js'))
.factory('QuillOAuthService', require('./oauth.js'));
