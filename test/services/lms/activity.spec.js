/* jshint expr:true */
'use strict';

describe('Activity', function () {
  beforeEach(module('quill-grammar.services.lms.activity'));

  var Activity,
      $httpBackend;

  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('empiricalBaseURL', 'http://foo.bar/api/v1');
    });

    inject(function (_Activity_, _$httpBackend_) {
      Activity = _Activity_;
      $httpBackend = _$httpBackend_;
    });
  });

  describe('#create', function () {
    var activity;
    beforeEach(function () {
      activity = new Activity({
        uid: 'foobar',
        name: 'foobar'
      });
    });

    beforeEach(function () {
      $httpBackend.expectPOST('http://foo.bar/api/v1/activities')
                  .respond(200);
    });

    it('creates an activity on the LMS', function (done) {
      activity.create().then(function () {
        done();
      });
      $httpBackend.flush();
    });
  });

  describe('#isValid', function () {
    var activity;
    describe('when missing one or more keys', function () {
      beforeEach(function () {
        activity = new Activity({
          uid: 'foobar'
        });
      });

      it('returns false', function () {
        expect(activity.isValid()).to.be.false;
      });

      it('tacks on some validation errors', function () {
        activity.isValid();
        expect(activity.errorMessages).to.contain('Activity cannot be submitted without required keys');
      });
    });

    // WHEN KEYS ARE PRESENT BUT EMPTY
  });
});
