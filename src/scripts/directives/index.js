'use strict';

/*@ngInject*/
module.exports =
angular.module('quill-grammar.directives', [])
.directive('activityProgressBar', require('./progressBar.js').directive)
.directive('navbar', require('./navbar.js').directive)
.controller('ProgressBarCtrl', require('./progressBar.js').controller)
.controller('NavbarCtrl', require('./navbar.js').controller);
