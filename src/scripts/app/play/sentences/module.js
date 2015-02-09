'use strict';

module.exports =

angular.module('quill-grammar.play.sentences', [
  require('./../../../services/sentenceWriting.js').name,
  require('./../../../directives/grammarElements/sentenceWriting/').name,
])
.config(require('./config.js'))
.controller('SentencePlayCtrl', require('./controller.js'));
