'use strict';

module.exports =

angular.module('quill-grammar.play.sentences', [
  require('./../../../services/sentenceWriting.js').name,
])
.config(require('./config.js'))
.controller('SentencePlayCtrl', require('./controller.js'));
