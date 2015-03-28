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
    require('../../../../.tmp/config').name,
    require('../../../../.tmp/templates').name,
    require('../../directives/index.js').name,
  ]);
