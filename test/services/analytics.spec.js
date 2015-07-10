describe('analytics service', function() {
  var sandbox,
      $rootScope,
      analyticsService,
      $analytics,
      $q;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  beforeEach(module('quill-grammar.services.analytics'));

  beforeEach(inject(function(_$rootScope_, _$q_, _$analytics_, AnalyticsService) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    analyticsService = AnalyticsService;
    $analytics = _$analytics_;
  }));

  afterEach(function() {
    sandbox.verifyAndRestore();
  });

  describe('#trackSentenceWritingSubmission', function() {
    var fakeResults = [
      {
        conceptClass: 'gerblah',
        correct: true,
        answer: 'pffft'
      }
    ];

    var fakePassageId = 'fake-passage-id';

    it('sends the event with the expected payload', function() {
      var payload = {
        uid: fakePassageId,
        answers: ['pffft'],
        correct: [true],
        conceptCategory: ['gerblah'],
        total: 1,
        numCorrect: 1
      };
      $analytics.eventTrack = sandbox.spy();
      analyticsService.trackSentenceWritingSubmission(fakeResults, fakePassageId);
      expect($analytics.eventTrack).to.have.been.calledWith('Sentence Writing Submitted', payload);
    });
  });
});
