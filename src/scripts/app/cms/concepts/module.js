'use strict';

module.exports =

angular.module('quill-grammar.cms.concepts', [
  require('./directives/index.js').name,
])
.config(require('./config.js'))
.controller('ConceptsCmsCtrl', require('./controller.js'))
.controller('ConceptsCreateCmsCtrl', require('./create.controller.js'))
;
