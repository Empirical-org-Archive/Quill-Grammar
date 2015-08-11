'use strict';

module.exports =

angular.module('quill-grammar.cms.grammarActivities', [
  require('./directives/index.js').name,
])
.config(require('./config.js'))
.controller('GrammarActivitiesCmsCtrl', require('./controller.js'))
.controller('GrammarActivitiesCreateCmsCtrl', require('./create.controller.js'))
;
