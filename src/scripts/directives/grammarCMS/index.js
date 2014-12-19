'use strict';
module.exports =

angular
  .module('quill-grammar.directives.grammarCMS', [
  ])
  .directive('grammarCMSCategoriesNew', require('./categories.new.js'))
  .directive('grammarCMSCategoriesList', require('./categories.list.js'))
  .controller('GrammarCMSCtrl', require('./cms.controller.js'));
