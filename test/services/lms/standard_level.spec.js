'use strict';
/* globals _ */

describe('StandardLevelService', function () {
  beforeEach(module('quill-grammar.services.lms.standard_level'));

  var standardLevelService,
      $httpBackend;

  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('empiricalBaseURL', 'http://foo.bar/api/v1');
    });

    inject(function (StandardLevelService, _$httpBackend_) {
      standardLevelService = StandardLevelService;
      $httpBackend = _$httpBackend_;
    });
  });

  describe('#get', function () {
    var fakeSectionsResponse = [
      {name: 'foobar', uid: 'baz'},
      {name: 'buzzbar', uid: 'quux'}
    ];

    beforeEach(function () {
      $httpBackend.expectGET('http://foo.bar/api/v1/sections')
                  .respond(fakeSectionsResponse);
    });

    it('gets all standard levels', function (done) {
      standardLevelService.get().then(function (standardLevels) {
        _.each(standardLevels, function (t) {
          expect(t).to.be.an('object');
          expect(t.uid).to.be.a('string');
          expect(t.name).to.be.a('string');
        });
        done();
      });
      $httpBackend.flush();
    });
  });
});
