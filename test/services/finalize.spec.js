'use strict';

describe('finalizeService', function () {
  beforeEach(module('quill-grammar.services.finalize'));

  var sandbox,
      finalizeService,
      $rootScope,
      conceptResultService,
      activitySessionService,
      localStorageService,
      quillOAuthService,
      $q;

  beforeEach(inject(function (_finalizeService_, _$rootScope_, ConceptResult, _localStorageService_, ActivitySession, _$q_, QuillOAuthService) {
    sandbox = sinon.sandbox.create();
    finalizeService = _finalizeService_;
    conceptResultService = ConceptResult;
    activitySessionService = ActivitySession;
    localStorageService = _localStorageService_;
    quillOAuthService = QuillOAuthService;
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
    var fakeConceptResultsList = [
      {foo: 'bar', correct: 1},
      {foo: 'bar', correct: 0}
    ];

    var fakePfResults = [
      {
        conceptClass: 'cool',
        correct: 2,
        total: 3
      },
      {
        conceptClass: 'very cool',
        correct: 0,
        total: 5
      }
    ];

    beforeEach(function () {
      // ConceptResult.findAsJsonByActivitySessionId(...)
      sandbox.mock(conceptResultService)
             .expects('findAsJsonByActivitySessionId')
             .withArgs('fake-session-id')
             .returns($q.when(fakeConceptResultsList));

      sandbox.mock(localStorageService)
             .expects('get')
             .withArgs('pf-fake-passage-id')
             .returns(fakePfResults);

      // gets concept tag results from firebase and sends to LMS

      // ActivitySession.finish(...)
      sandbox.mock(activitySessionService)
             .expects('finish')
             .withArgs('fake-session-id', {
               // FIXME: Do not uncomment this line until the LMS concept tag integration works again.
               // concept_tag_results: fakeConceptResultsList,
               percentage: 0.3
             })
             .returns($q.when());

      // Removes the concept tag results afterwards
      sandbox.mock(conceptResultService)
              .expects('removeBySessionId')
              .withArgs('fake-session-id')
              .returns($q.when());

      sandbox.mock(quillOAuthService)
             .expects('expire')
             .returns($q.when());
    });

    it('saves when a session ID is present', function (done) {
      finalizeService('fake-session-id', 'fake-passage-id').then(done);
      $rootScope.$apply();
    });
  });
});
