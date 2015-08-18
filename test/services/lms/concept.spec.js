'use strict';
/* globals _ */

describe('ConceptService', function () {
  beforeEach(module('quill-grammar.services.lms.concept'));

  var conceptService;
  var timeout;

  beforeEach(function () {
    inject(function (ConceptService, $timeout) {
      conceptService = ConceptService;
      timeout = $timeout;
    });
  });

  describe('API Concepts', function () {
    it('gets all concepts', function (done) {
      conceptService.get().then(function (conceptLevels) {
        expect(conceptLevels).to.have.property('concept_level_0');
        expect(conceptLevels).to.have.property('concept_level_1');
        expect(conceptLevels).to.have.property('concept_level_2');
        _.each(conceptLevels, function (l) {
          _.each(l, function (c) {
            expect(c.uid).to.be.a('string');
            expect(c.title).to.be.a('string');
          });
        });
        done();
      });
      timeout.flush();
    });
  });
});
