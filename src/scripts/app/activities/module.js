'use strict';

module.exports =

angular.module('quill-grammar.activities', [])
.config(require('./config.js'))
.controller('activities', require('./controller.js'));
