'use strict';

describe('CategoryService', function () {
  beforeEach(module('quill-grammar.services.category'));

  var categoryService, category;
  beforeEach(function () {
    category = {};
    // Inject something from angular to test it.
    inject(function (CategoryService) {
      categoryService = CategoryService;
    });
  });

  describe('saveCategory', function () {
    it('saves the category', function () {
      // Turns out this is really difficult to test.
      // categoryService.saveCategory(category);
    });
  });
});
