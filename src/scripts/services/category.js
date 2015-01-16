'use strict';

module.exports =
angular.module('quill-grammar.services.category', [
  require('./crud.js').name,
])

.factory('CategoryService', function(CrudService) {
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
  return this;
});
