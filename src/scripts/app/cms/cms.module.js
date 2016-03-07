'use strict';
module.exports =

angular
  .module('quill-grammar.cms', [
    require('./concepts/module.js').name,
    require('./grammarActivities/module.js').name,
    require('./proofreaderActivities/module.js').name,
    require('./errorReports/module.js').name,
  ])
  .config(require('./cms.config.js'))
  .controller('cms', require('./cms.controller.js'));
