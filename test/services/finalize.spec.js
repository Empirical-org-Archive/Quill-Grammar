// MockFirebase.override();

describe('', function() {
  beforeEach(module('quill-grammar.services.finalize'));

  var sandbox,
      finalizeService,
      $rootScope,
      conceptTagResultService,
      activitySessionService,
      $q;

  function promiseReturning(val) {
    var d = $q.defer();
    d.resolve(val);
    return d.promise;
  }
  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    inject(function(_finalizeService_, _$rootScope_, ConceptTagResult, ActivitySession, _$q_) {
      finalizeService = _finalizeService_;
      conceptTagResultService = ConceptTagResult;
      activitySessionService = ActivitySession;
      $rootScope = _$rootScope_;
      $q = _$q_;
    });
  });

  afterEach(function() {
    sandbox.verifyAndRestore();
  });

  it('returns a promise', function(done) {
    finalizeService().then(done);
    $rootScope.$apply();
  });

  describe('saving to the LMS', function() {
    var fakeConceptTagResultsList = [
      {foo: 'bar'}
    ];

    beforeEach(function() {
      // ConceptTagResult.findAsJsonByActivitySessionId(...)
      sandbox.mock(conceptTagResultService)
             .expects('findAsJsonByActivitySessionId')
             .withArgs('fake-session-id')
             .returns(promiseReturning(fakeConceptTagResultsList));

      // gets concept tag results from firebase and sends to LMS

      // ActivitySession.finish(...)
      sandbox.mock(activitySessionService)
             .expects('finish')
             .withArgs('fake-session-id', {
              concept_tag_results: fakeConceptTagResultsList,
              percentage: 1,
             })
             .returns(promiseReturning());

       sandbox.mock(conceptTagResultService)
              .expects('removeBySessionId')
              .withArgs('fake-session-id')
              .returns(promiseReturning());
    });

    it('only saves when a session ID is present', function(done) {
      finalizeService('fake-session-id').then(done);
      $rootScope.$apply();
    });
  });
});
