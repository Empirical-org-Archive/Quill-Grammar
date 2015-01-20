'use strict';

module.exports =
angular.module('quill-grammar.services.category', [
  require('./crud.js').name,
])

.factory('CategoryService', function(CrudService, _) {
  var crud = new CrudService('categories', [
    'title', 'rules'
  ]);
  this.saveCategory = function(category) {
    return crud.save(category);
  };
  this.deleteCategory = function (category) {
    return crud.del(category);
  };

  this.getCategories = function() {
    return crud.all();
  };

  this.updateCategory = function(category) {
    return crud.update(category);
  };

  this.removeRuleFromCategory = function(category, rule) {
    if (!category || !category.rules) {
      throw new Error('Category does not have any rules to remove');
    }
    _.each(category.rules, function(r, key) {
      if (key === rule.$id) {
        category.rules[key] = null;
      }
    });
    return crud.update(category);
  };
  return this;
});
