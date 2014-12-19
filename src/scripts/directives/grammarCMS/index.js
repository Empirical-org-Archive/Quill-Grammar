'use strict';
module.exports =

angular
  .module('quill-grammar.directives.grammarCMS', [
  ])
  .directive('grammarCmsCategoriesNew', require('./categories.new.js'))
  .directive('grammarCmsCategoriesList', require('./categories.list.js'))
  .controller('GrammarCmsCtrl', require('./cms.controller.js'));
