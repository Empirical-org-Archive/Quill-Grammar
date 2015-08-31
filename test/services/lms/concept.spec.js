'use strict';
/* globals _ */

describe('ConceptService', function () {
  beforeEach(module('quill-grammar.services.lms.concept'));

  var conceptService,
      $httpBackend;

  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('empiricalBaseURL', 'http://foo.bar/api/v1');
    });

    inject(function (ConceptService, _$httpBackend_) {
      conceptService = ConceptService;
      $httpBackend = _$httpBackend_;
    });
  });

  describe('#get', function () {
    var fakeConceptsResponse = [
      {name: 'foobar', uid: 'baz'},
      {name: 'buzzbar', uid: 'quux'}
    ];

    beforeEach(function () {
      $httpBackend.expectGET('http://foo.bar/api/v1/concepts')
                  .respond(fakeConceptsResponse);
    });

    it('gets all concepts', function (done) {
      conceptService.get().then(function (conceptLevels) {
        expect(conceptLevels).to.have.property('concept_level_0');
        expect(conceptLevels).to.have.property('concept_level_1');
        expect(conceptLevels).to.have.property('concept_level_2');
        _.each(conceptLevels, function (l) {
          _.each(l, function (c) {
            expect(c.uid).to.be.a('string');
            expect(c.name).to.be.a('string');
          });
        });
        done();
      });
      $httpBackend.flush();
    });
  });
});
