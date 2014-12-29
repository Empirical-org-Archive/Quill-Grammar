'use strict';
module.exports =

angular
  .module('quill-grammar.directives.grammarCMS', [
  ])
  .directive('grammarCmsCategoriesNew', require('./categories.new.js'))
  .directive('grammarCmsCategoriesList', require('./categories.list.js'))
  .directive('grammarCmsCategory', require('./category.show.js'))
  .directive('grammarCmsRule', require('./rule.show.js'))
  .controller('GrammarCmsCtrl', require('./cms.controller.js'));
