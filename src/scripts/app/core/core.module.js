'use strict';
module.exports =

angular
  .module('quill-grammar.core', [
    'ui.router',
    require('../../../../.tmp/config').name,
    require('../../../../.tmp/templates').name,
    require('../../directives/index.js').name,
  ]);
