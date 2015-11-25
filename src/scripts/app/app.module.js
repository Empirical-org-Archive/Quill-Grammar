'use strict';

angular
  .module('quill-grammar', [
    require('empirical-angular').name,
    require('./core/core.module.js').name,
    require('./index/index.module.js').name,
    require('./cms/cms.module.js').name,
    require('./play/sentences/module.js').name,
    require('./play/proofreadings/module.js').name,
    require('./layout/layout.module.js').name,
  ])
  .config(require('./app.config.js'));
