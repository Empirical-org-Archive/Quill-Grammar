'use strict';

module.exports =

angular.module('quill-grammar.cms.activities', [
  require('./practiceQuestions/module.js').name,
  require('./stories/module.js').name,
])
.config(require('./config.js'))
.controller('ActivitiesCmsCtrl', require('./controller.js'))
;
