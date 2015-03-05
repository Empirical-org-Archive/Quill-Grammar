'use strict';

module.exports =

angular.module('quill-grammar.play.sentences', [
  require('./../../../services/sentenceWriting.js').name,
])
.config(require('./config.js'))
.controller('ResultsController', require('./results.controller.js'))
.controller('SentencePlayCtrl', require('./controller.js'));
