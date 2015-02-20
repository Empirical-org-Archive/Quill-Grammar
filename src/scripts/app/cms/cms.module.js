'use strict';
module.exports =

angular
  .module('quill-grammar.cms', [
    require('./../../directives/grammarCMS').name,
    require('./../../filters/').name,
  ])
  .config(require('./cms.config.js'))
  .controller('cms', require('./cms.controller.js'));
