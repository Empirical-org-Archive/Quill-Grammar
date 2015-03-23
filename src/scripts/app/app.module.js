'use strict';

angular
  .module('quill-grammar', [
    require('./core/core.module.js').name,
    require('./index/index.module.js').name,
    require('./cms/cms.module.js').name,
    require('./play/sentences/module.js').name,
    require('./play/proofreadings/module.js').name,
    require('./play/results/module.js').name,
    require('./activities/module.js').name,
    require('./layout/layout.module.js').name,
    require('empirical-angular').name,
  ])
  .config(require('./app.config.js'));
