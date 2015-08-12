'use strict';

describe('ThemeService', function () {
  beforeEach(module('quill-grammar.services.lms.theme'));

  var themeService;

  beforeEach(function () {
    inject(function (ThemeService) {
      themeService = ThemeService;
    });
  });

  describe('API Themes', function () {
    it('gets all themes', function (done) {
      themeService.get().then(function (themes) {
        console.log(themes);
        done();
      });
    });
  });
});
