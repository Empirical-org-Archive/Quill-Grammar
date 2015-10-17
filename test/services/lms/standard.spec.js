'use strict';
/* globals _ */

describe('StandardService', function () {
  beforeEach(module('quill-grammar.services.lms.standard'));

  var standardService,
      $httpBackend;

  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('empiricalBaseURL', 'http://foo.bar/api/v1');
    });

    inject(function (StandardService, _$httpBackend_) {
      standardService = StandardService;
      $httpBackend = _$httpBackend_;
    });
  });

  describe('#get', function () {
    var fakeTopicsResponse = [
      {name: 'foobar', uid: 'baz'},
      {name: 'buzzbar', uid: 'quux'}
    ];

    beforeEach(function () {
      $httpBackend.expectGET('http://foo.bar/api/v1/topics')
                  .respond(fakeTopicsResponse);
    });

    it('gets all standards', function (done) {
      standardService.get().then(function (standards) {
        _.each(standards, function (t) {
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
