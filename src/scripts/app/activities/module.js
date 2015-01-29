'use strict';

module.exports =

angular.module('quill-grammar.activities', [
  require('./sentences/module.js').name,
])
.config(require('./config.js'))
.controller('activities', require('./controller.js'));
