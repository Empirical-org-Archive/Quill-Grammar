'use strict';

angular
  .module('quill-grammar', [
    require('./core/core.module.js').name,
    require('./welcome/welcome.module.js').name,
    require('./index/index.module.js').name,
    require('./layout/layout.module.js').name
  ])
  .config(require('./app.config.js'));
