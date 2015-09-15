'use strict';

describe('ProofreaderActivity', function () {
  beforeEach(module('quill-grammar.services.firebase.proofreaderActivity'));
  beforeEach(module('test.fixtures.firebase'));

  var $rootScope,
      ProofreaderActivity;

  beforeEach(inject(function (_$rootScope_, _ProofreaderActivity_, setupMockFirebaseData) {
    $rootScope = _$rootScope_;
    ProofreaderActivity = _ProofreaderActivity_;
    setupMockFirebaseData();
  }));

  describe('#getById', function () {
    var proofreaderActivity1Id,
        proofreaderActivity1Json;
    beforeEach(inject(function (_proofreaderActivity1Id_, _proofreaderActivity1Json_) {
      proofreaderActivity1Id = _proofreaderActivity1Id_;
      proofreaderActivity1Json = _proofreaderActivity1Json_;
    }));

    it('gets the activity from firebase', function (done) {
      ProofreaderActivity.getById(proofreaderActivity1Id).then(function (activity) {
        expect(activity.title).to.equal(proofreaderActivity1Json.title);
        done();
      });
      ProofreaderActivity.ref.flush();
      $rootScope.$digest();
    });
  });
});
