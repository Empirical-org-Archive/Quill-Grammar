'use strict';
module.exports =

angular
  .module('quill-grammar.index', [])
  .config(require('./index.config.js'))
  .controller('index', require('./index.controller.js'));
