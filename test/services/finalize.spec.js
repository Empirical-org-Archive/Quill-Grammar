'use strict';

describe('finalizeService', function () {
  beforeEach(module('quill-grammar.services.finalize'));

  var sandbox,
      finalizeService,
      $rootScope,
      conceptTagResultService,
      activitySessionService,
      $q;

  beforeEach(inject(function (_finalizeService_, _$rootScope_, ConceptTagResult, ActivitySession, _$q_) {
    sandbox = sinon.sandbox.create();
    finalizeService = _finalizeService_;
    conceptTagResultService = ConceptTagResult;
    activitySessionService = ActivitySession;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  it('returns a promise', function (done) {
    finalizeService().then(done);
    $rootScope.$apply();
  });

  describe('saving to the LMS', function () {
    var fakeConceptTagResultsList = [
      {foo: 'bar', correct: 1},
      {foo: 'bar', correct: 0}
    ];

    beforeEach(function () {
      // ConceptTagResult.findAsJsonByActivitySessionId(...)
      sandbox.mock(conceptTagResultService)
             .expects('findAsJsonByActivitySessionId')
             .withArgs('fake-session-id')
             .returns($q.when(fakeConceptTagResultsList));

      var localStorageService;
      sandbox.mock(localStorageService)
             .expects('get')
             .withArgs('pf-fake-passageId')
             .returns($q.when(fakeConceptTagResultsList));

      // gets concept tag results from firebase and sends to LMS

      // ActivitySession.finish(...)
      sandbox.mock(activitySessionService)
             .expects('finish')
             .withArgs('fake-session-id', {
               concept_tag_results: fakeConceptTagResultsList,
               percentage: 0.5
             })
             .returns($q.when());

      // Removes the concept tag results afterwards
      sandbox.mock(conceptTagResultService)
              .expects('removeBySessionId')
              .withArgs('fake-session-id')
              .returns($q.when());
    });

    it('saves when a session ID is present', function (done) {
      finalizeService('fake-session-id', 'fake-passage-id').then(done);
      $rootScope.$apply();
    });
  });
});
