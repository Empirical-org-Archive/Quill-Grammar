'use strict';

module.exports = angular.module('quill-grammar.play.proofreadings', [
  require('./../../../services/proofreading.js').name,
])
.config(require('./config.js'))
.filter('passageProofreadingFormatter', require('./passageFormatter.js'))
.controller('ProofreadingPlayCtrl', require('./controller.js'));
