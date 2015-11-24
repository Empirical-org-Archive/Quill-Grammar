/* globals _ */
'use strict';

describe('ConceptFBService', function () {
  beforeEach(module('quill-grammar.services.firebase.concepts'));
  beforeEach(module('test.fixtures.firebase'));
  beforeEach(module('empirical-angular'));

  var conceptService,
      allConceptsJson,
      $rootScope;

  beforeEach(function () {
    inject(function (ConceptsFBService, setupMockFirebaseData, _allConceptsJson_, _$rootScope_) {
      conceptService = ConceptsFBService;
      allConceptsJson = _allConceptsJson_;
      $rootScope = _$rootScope_;
      setupMockFirebaseData();
    });
  });

  describe('Firebase Concepts', function () {
    it('should be defined', function () {
      expect(conceptService).to.be.an('object');
      expect(conceptService.get).to.be.a('function');
    });
  });

  describe('#get', function () {
    it('retrieves all the concepts', function (done) {
      conceptService.get().then(function (concepts) {
        expect(concepts).to.have.length(_.keys(allConceptsJson).length);
        done();
      });
      conceptService.ref.flush();
      $rootScope.$digest();
    });
  });
});
