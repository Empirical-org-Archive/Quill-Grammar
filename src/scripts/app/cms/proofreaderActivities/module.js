'use strict';

module.exports =

angular.module('quill-grammar.cms.proofreaderActivities', [
  require('./directives/index.js').name,
  require('./../../../services/lms/activity.js').name
])
.config(require('./config.js'))
.controller('ProofreaderActivitiesCmsCtrl', require('./controller.js'))
.controller('ProofreaderActivitiesCreateCmsCtrl', require('./create.controller.js'))
.controller('ProofreaderActivitiesEditCmsCtrl', require('./edit.controller.js'))
;
