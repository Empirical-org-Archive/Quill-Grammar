'use strict';

module.exports =

angular.module('quill-grammar.cms.error-reports', [
  require('./../../../services/lms/errorReport.js').name
])
.config(require('./config.js'))
.controller('ErrorReportsCmsCtrl', require('./controller.js'))
.controller('ErrorReportsViewCmsCtrl', require('./viewController.js'))
;
