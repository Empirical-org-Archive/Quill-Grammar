'use strict';

/*
 * Production Browerify
 */
require('ng-autofocus/autofocus');
module.exports =

angular
  .module('quill-grammar.core', [
    'ui.router',
    'LocalStorageModule',
    'autofocus',
    'duScroll',
    'angulartics',
    'angulartics.mixpanel',
    require('../../../../.tmp/config').name,
    require('../../../../.tmp/templates').name,
    require('../../directives/index.js').name,
  ])
  .config(function ($analyticsProvider) {
    $analyticsProvider.virtualPageviews(false);
  });
