'use strict';

describe('ConceptFBService', function () {
  beforeEach(module('quill-grammar.services.firebase.concepts'));

  var conceptService;

  beforeEach(function () {
    inject(function (ConceptsFBService) {
      conceptService = ConceptsFBService;
    });
  });

  describe('Firebase Concepts', function () {
    it('should be defined', function () {
      expect(conceptService).to.be.an('object');
    });
  });
});
