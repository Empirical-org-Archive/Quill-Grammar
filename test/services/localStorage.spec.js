describe('SentenceLocalStorage service', function() {
  var sandbox,
      $rootScope,
      localStorageService,
      sentenceLocalStorageService,
      getSpy,
      setSpy,
      $q;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  beforeEach(module('quill-grammar.services.localStorage'));

  beforeEach(inject(function(_$rootScope_, _$q_, _localStorageService_, SentenceLocalStorage) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    sentenceLocalStorageService = SentenceLocalStorage;
    localStorageService = _localStorageService_;
    getSpy = sandbox.stub(localStorageService, 'get');
    setSpy = sandbox.spy(localStorageService, 'set');
  }));

  afterEach(function() {
    sandbox.verifyAndRestore();
  });

  describe('#storeTempResult', function() {
    var fakePassageId = 'fake-id',
        fakeRuleQuestion = {
          conceptCategory: 'bar'
        },
        fakeAnswer = 'baz';

    it('stores temporary results in an array', function() {
      getSpy.returns(null);
      sentenceLocalStorageService.storeTempResult(fakePassageId,
        fakeRuleQuestion, fakeAnswer, true);
      expect(setSpy).to.have.been.calledWith('sw-temp-fake-id',
        [{ answer: "baz", conceptClass: 'bar', correct: true }]);
    });
  });

  describe('#storeResults', function() {
    it('stores results', function() {

    });
  });
});
