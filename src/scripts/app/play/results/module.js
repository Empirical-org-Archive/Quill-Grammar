'use strict';

module.exports =

angular.module('quill-grammar.play.results', [])
.config(require('./config.js'))
.controller('InternalResultsCtrl', require('./controller.js'));
