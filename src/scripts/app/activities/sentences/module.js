'use strict';

module.exports =

angular.module('quill-grammar.activities.sentences', [])
.config(require('./config.js'))
.controller('sentences', require('./controller.js'));
