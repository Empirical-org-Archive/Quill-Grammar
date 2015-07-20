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
    require('../../services/auth').name,
  ])
  .config(function ($analyticsProvider) {
    $analyticsProvider.virtualPageviews(false);
  })
  .run(require('./core.run.js'));
