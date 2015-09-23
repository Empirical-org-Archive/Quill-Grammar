'use strict';

describe('TopicCategoryService', function () {
  beforeEach(module('quill-grammar.services.lms.topicCategory'));

  var TopicCategoryService,
      $httpBackend;

  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('empiricalBaseURL', 'http://foo.bar/api/v1');
    });

    inject(function (_TopicCategoryService_, _$httpBackend_) {
      TopicCategoryService = _TopicCategoryService_;
      $httpBackend = _$httpBackend_;
    });
  });

  describe('API TopicCategory', function () {
    it('gets all', function (done) {
      var responseData = {
        topic_categories: 'foobar'
      };
      $httpBackend.expectGET('http://foo.bar/api/v1/topic_categories')
                  .respond(responseData);

      TopicCategoryService.get().then(function (topicCategories) {
        expect(topicCategories).to.equal('foobar');
        done();
      });
      $httpBackend.flush();
    });
  });
});
