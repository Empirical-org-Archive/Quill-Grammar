'use strict';

describe('ProofreadingPassage', function () {
  beforeEach(module('quill-grammar.services.proofreadingPassage'));
  beforeEach(module('test.fixtures.firebase'));
  beforeEach(module('empirical-angular'));

  var $rootScope,
      sandbox,
      ProofreadingPassage,
      ConceptsFBService,
      PassageWord,
      proofreaderActivity2Json;

  beforeEach(inject(function (_$rootScope_, _ProofreadingPassage_,
    _ConceptsFBService_, setupMockFirebaseData, _PassageWord_,
    _proofreaderActivity2Json_) {
    $rootScope = _$rootScope_;
    ConceptsFBService = _ConceptsFBService_;
    sandbox = sinon.sandbox.create();
    PassageWord = _PassageWord_;
    ProofreadingPassage = _ProofreadingPassage_;
    proofreaderActivity2Json = _proofreaderActivity2Json_;
    setupMockFirebaseData();
  }));

  describe('#fromPassageString', function () {
    it('returns a ProofreadingPassage instance via promise', function (done) {
      ProofreadingPassage.fromPassageString(proofreaderActivity2Json.passage).then(function (proofreadingPassage) {
        expect(proofreadingPassage).to.be.instanceof(ProofreadingPassage);
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('includes the concepts referenced in the passage by rule number', function (done) {
      ProofreadingPassage.fromPassageString(proofreaderActivity2Json.passage).then(function (proofreadingPassage) {
        expect(proofreadingPassage.concepts).to.have.length(1);
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('includes a list of PassageWord instances', function (done) {
      ProofreadingPassage.fromPassageString(proofreaderActivity2Json.passage).then(function (proofreadingPassage) {
        expect(proofreadingPassage.words).to.have.length(4);
        expect(proofreadingPassage.words[0]).to.be.instanceof(PassageWord);
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });
  });

  describe('#submit', function () {
    var proofreadingPassage;
    beforeEach(function (done) {
      ProofreadingPassage.fromPassageString(proofreaderActivity2Json.passage).then(function (_proofreadingPassage_) {
        proofreadingPassage = _proofreadingPassage_;
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('creates a set of result objects, one for each concept', function () {
      proofreadingPassage.submit();
      expect(proofreadingPassage.results).to.have.length(1);
    });

    it('creates result objects with the correct format', function () {
      var expectedResultKeys = ['index', 'passageEntry', 'type'];
      proofreadingPassage.submit();
      expect(proofreadingPassage.results[0]).to.have.all.keys(expectedResultKeys);
    });
  });

  describe('#saveLocalResults', function () {
    var proofreadingPassage,
      expectedSavedData,
      localStorageSpy,
      localStorageService;

    beforeEach(inject(function (_localStorageService_) {
      localStorageService = _localStorageService_;
    }));

    beforeEach(function (done) {
      ProofreadingPassage.fromPassageString(proofreaderActivity2Json.passage).then(function (_proofreadingPassage_) {
        proofreadingPassage = _proofreadingPassage_;
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    beforeEach(function () {
      localStorageSpy = sandbox.spy(localStorageService, 'set');
      expectedSavedData = [
        {
          concept: 'You\'re',
          total: 1,
          correct: 0
        }
      ];
    });

    it('saves passage results to localStorage', function () {
      proofreadingPassage.submit(); // Generate some results
      proofreadingPassage.saveLocalResults('fake-passage-id');
      expect(localStorageSpy).to.have.been
        .calledWith('pf-fake-passage-id', expectedSavedData);
    });
  });
});
