'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.directives', [])
.directive('activityProgressBar', require('./progressBar.js').directive)
.controller('ProgressBarCtrl', require('./progressBar.js').controller);
