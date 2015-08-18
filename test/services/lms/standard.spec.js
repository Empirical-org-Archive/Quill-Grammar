'use strict';
/* globals _ */

describe('StandardService', function () {
  beforeEach(module('quill-grammar.services.lms.standard'));

  var standardService;
  var timeout;

  beforeEach(function () {
    inject(function (StandardService, $timeout) {
      standardService = StandardService;
      timeout = $timeout;
    });
  });

  describe('API Standards', function () {
    it('gets all standards', function (done) {
      standardService.get().then(function (standards) {
        _.each(standards, function (t) {
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
