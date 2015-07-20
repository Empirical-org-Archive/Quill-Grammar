'use strict';
module.exports =

angular
  .module('quill-grammar.layout', [
    'ui.router'
  ])
  .config(require('./layout.config.js'));
