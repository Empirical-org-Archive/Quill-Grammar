'use strict';

module.exports =

angular.module('quill-grammar.activities.proofreadings', [
  require('./../../../services/proofreading.js').name,
])
.config(require('./config.js'))
.controller('ProofreadingsCtrl', require('./controller.js'));
