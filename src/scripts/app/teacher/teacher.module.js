'use strict';
module.exports =

angular
  .module('quill-grammar.teacher', [
    require('./../../directives/grammarCMS').name
  ])
  .config(require('./teacher.config.js'))
  .controller('teacher', require('./teacher.controller.js'));
