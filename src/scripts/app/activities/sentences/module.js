'use strict';

module.exports =

angular.module('quill-grammar.activities.sentences', [
  require('./../../../services/sentenceWriting.js').name,
])
.config(require('./config.js'))
.controller('EditSentenceCtrl', require('./editSentence.js'))
.controller('SentencesCtrl', require('./controller.js'));
