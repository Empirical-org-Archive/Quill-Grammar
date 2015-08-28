'use strict';

module.exports =

angular.module('quill-grammar.cms.concepts', [
  require('./directives/index.js').name,
  require('./../../../services/v2/concepts.js').name,
])
.config(require('./config.js'))
.controller('ConceptsCmsCtrl', require('./controller.js'))
.controller('ConceptsCreateCmsCtrl', require('./create.controller.js'))
.controller('ConceptsViewCmsCtrl', require('./view.controller.js'))
.controller('ConceptsQuestionsCreateCmsCtrl', require('./questions.create.controller.js'))
.controller('ConceptsQuestionsEditCmsCtrl', require('./questions.edit.controller.js'))
;
