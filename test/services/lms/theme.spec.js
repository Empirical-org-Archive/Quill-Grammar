'use strict';

describe('ThemeService', function () {
  beforeEach(module('quill-grammar.services.lms.theme'));

  var themeService;
  var timeout;

  beforeEach(function () {
    inject(function (ThemeService, $timeout) {
      themeService = ThemeService;
      timeout = $timeout;
    });
  });

  describe('API Themes', function () {
    it('gets all themes', function (done) {
      themeService.get().then(function (themes) {
        done();
      });
      timeout.flush();
    });
  });
});
