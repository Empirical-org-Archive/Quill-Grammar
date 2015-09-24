'use strict';

module.exports =

angular.module('quill-grammar.cms.grammarActivities', [
  require('./directives/index.js').name,
  require('./../../../services/lms/activity.js').name
])
.config(require('./config.js'))
.controller('GrammarActivitiesCmsCtrl', require('./controller.js'))
.controller('GrammarActivitiesCreateCmsCtrl', require('./create.controller.js'))
.controller('GrammarActivitiesEditCmsCtrl', require('./edit.controller.js'))
;
