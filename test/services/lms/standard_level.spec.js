'use strict';
/* globals _ */

describe('StandardLevelService', function () {
  beforeEach(module('quill-grammar.services.lms.standard_level'));

  var standardLevelService;
  var timeout;

  beforeEach(function () {
    inject(function (StandardLevelService, $timeout) {
      standardLevelService = StandardLevelService;
      timeout = $timeout;
    });
  });

  describe('API Standard Levels', function () {
    it('gets all standard levels', function (done) {
      standardLevelService.get().then(function (standardLevels) {
        _.each(standardLevels, function (t) {
          expect(t).to.be.an('object');
          expect(t.uid).to.be.a('string');
          expect(t.title).to.be.a('string');
        });
        done();
      });
      timeout.flush();
    });
  });
});
