'use strict';
module.exports =

angular
  .module('quill-grammar.teacher', [])
  .config(require('./teacher.config.js'))
  .controller('teacher', require('./teacher.controller.js'));
