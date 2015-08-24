'use strict';

describe('ConceptResultService', function () {
  beforeEach(module('quill-grammar.services.lms.concept-result'));

  var conceptResultService, fakeSessionId, $rootScope;
  beforeEach(function () {
    fakeSessionId = '123456abcdef';
    inject(function (ConceptResult, _$rootScope_) {
      conceptResultService = ConceptResult;
      $rootScope = _$rootScope_;
    });
  });

  describe('#removeBySessionId', function () {
    it('returns a promise that resolves when the data is removed', function (done) {
      conceptResultService.removeBySessionId(fakeSessionId).then(function () {
        done();
      });
      $rootScope.$apply();
      conceptResultService.ref.flush();
      $rootScope.$apply(); // Have to invoke this twice in order to resolve after the firebase remove() callback.
    });

    it('removes the data', function() {
      conceptResultService.ref.child(fakeSessionId).set('fooo');
      conceptResultService.ref.flush();
      expect(conceptResultService.ref.getData()).to.be.ok;
      conceptResultService.removeBySessionId(fakeSessionId).then(function () {
        done();
      });
      $rootScope.$apply();
      conceptResultService.ref.flush();
      expect(conceptResultService.ref.getData()).to.not.be.ok;
    });
  });
});
