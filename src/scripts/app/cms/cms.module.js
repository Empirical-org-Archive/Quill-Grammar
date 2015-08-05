'use strict';
module.exports =

angular
  .module('quill-grammar.cms', [
    require('./stories/module.js').name,
    require('./practiceQuestions/module.js').name,
  ])
  .config(require('./cms.config.js'))
  .controller('cms', require('./cms.controller.js'));
