'use strict';
module.exports =

angular
  .module('quill-grammar.welcome', [])
  .config(require('./welcome.config.js'))
  .controller('welcome', require('./welcome.controller.js'));
