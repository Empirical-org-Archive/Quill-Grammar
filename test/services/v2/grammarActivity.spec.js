/* jshint expr:true */
'use strict';

describe('GrammarActivity', function () {
  beforeEach(module('quill-grammar.services.firebase.grammarActivity'));
  beforeEach(module('test.fixtures.firebase'));
  beforeEach(module('empirical-angular'));

  var GrammarActivity,
      ConceptsFBService,
      ConceptResult,
      grammarActivityJson,
      concept1Json,
      grammarActivity1Id,
      RuleService,
      Question,
      SentenceLocalStorage,
      $rootScope,
      $q,
      sandbox,
      TypingSpeed,
      UAParser;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function (_GrammarActivity_,
      _$rootScope_, _RuleService_, _$q_, _Question_, _SentenceLocalStorage_,
      _grammarActivityJson_, setupMockFirebaseData,
      _ConceptsFBService_, _concept1Json_, _grammarActivity1Id_,
      _ConceptResult_, _TypingSpeed_, _UAParser_) {
      GrammarActivity = _GrammarActivity_;
      ConceptsFBService = _ConceptsFBService_;
      ConceptResult = _ConceptResult_;
      TypingSpeed = _TypingSpeed_;
      UAParser = _UAParser_;
      grammarActivityJson = _grammarActivityJson_;
      $rootScope = _$rootScope_;
      RuleService = _RuleService_;
      Question = _Question_;
      SentenceLocalStorage = _SentenceLocalStorage_;
      $q = _$q_;
      concept1Json = _concept1Json_;
      setupMockFirebaseData();
      grammarActivity1Id = _grammarActivity1Id_;
    });
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  describe('.fromPassageResults', function () {
    var concept1RuleNumber,
      concept2RuleNumber,
      concept1Question1Json,
      concept1Level0Uid;
    beforeEach(inject(function (_concept1RuleNumber_, _concept2RuleNumber_, _concept1Question1Json_, _concept1Level0Uid_) {
      concept1RuleNumber = _concept1RuleNumber_;
      concept2RuleNumber = _concept2RuleNumber_;
      concept1Question1Json = _concept1Question1Json_;
      concept1Level0Uid = _concept1Level0Uid_;
    }));

    it('builds a custom grammar activity', function (done) {
      GrammarActivity.fromPassageResults([concept1RuleNumber, concept2RuleNumber], '').then(function (customGrammarActivity) {
        expect(customGrammarActivity).to.be.ok;
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('includes the passage ID on the generated activity', function (done) {
      var fakePassageId = 'abcdef6789';
      GrammarActivity.fromPassageResults([concept1RuleNumber, concept2RuleNumber], fakePassageId).then(function (customGrammarActivity) {
        expect(customGrammarActivity.passageId).to.equal(fakePassageId);
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('loads questions for use by the activity', function (done) {
      GrammarActivity.fromPassageResults([concept1RuleNumber, concept2RuleNumber], '').then(function (customGrammarActivity) {
        expect(customGrammarActivity.questions[0].answers).to.deep.equal(concept1Question1Json.answers);
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('tacks on a conceptUid property to each loaded question', function (done) {
      GrammarActivity.fromPassageResults([concept1RuleNumber, concept2RuleNumber], '').then(function (customGrammarActivity) {
        expect(customGrammarActivity.questions[0].conceptUid).to.equal(concept1Level0Uid);
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('loads the concepts referenced by the given rule numbers', function (done) {
      GrammarActivity.fromPassageResults([concept1RuleNumber, concept2RuleNumber], '').then(function (customGrammarActivity) {
        expect(customGrammarActivity.concepts[0].ruleNumber).to.equal(concept1RuleNumber);
        done();
      });
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });
  });

  describe('#getById', function () {
    it('loads the activity data from firebase', function (done) {
      GrammarActivity.getById(grammarActivity1Id).then(function (activity) {
        expect(activity.title).to.equal(grammarActivityJson.title);
        done();
      });
      GrammarActivity.ref.flush();
      $rootScope.$digest();
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('loads the appropriate concepts from firebase', function (done) {
      GrammarActivity.getById(grammarActivity1Id).then(function (activity) {
        expect(activity.concepts[0].ruleNumber).to.deep.equal(concept1Json.ruleNumber);
        done();
      });
      GrammarActivity.ref.flush();
      $rootScope.$digest();
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });

    it('loads a sample of questions based on activity concepts and quantities', function (done) {
      GrammarActivity.getById(grammarActivity1Id).then(function (activity) {
        expect(activity.questions).to.have.length.above(0);
        done();
      });
      GrammarActivity.ref.flush();
      $rootScope.$digest();
      ConceptsFBService.ref.flush();
      $rootScope.$digest();
    });
  });

  describe('#submitAnswer', function () {
    var grammarActivity,
        fakePassageId,
        question,
        localStorageSpy,
        conceptResultSpy;

    beforeEach(function () {
      question = new Question({
        response: 'incorrect response',
        body: ['correct response'],
        conceptUid: 'abcdef' // generated by loadQuestionsFromConcepts().
      });
      grammarActivity = new GrammarActivity(grammarActivityJson);
      localStorageSpy = sandbox.stub(SentenceLocalStorage, 'storeTempResult');
      conceptResultSpy = sandbox.spy(ConceptResult, 'saveToFirebase');
    });

    describe('concept results', function () {
      describe('when the gameplay session is anonymous', function () {
        it('does not save any concept results', function () {
          grammarActivity.submitAnswer(question, null);
          expect(conceptResultSpy).not.to.have.been.called;
        });
      });
    });

    describe('when the grammar activity was generated from a passage', function () {
      beforeEach(function () {
        fakePassageId = 'abcdef123';
        grammarActivity.passageId = fakePassageId;
      });

      it('saves temporary results to local storage', function () {
        grammarActivity.submitAnswer(question);
        expect(localStorageSpy).to.have.been.calledWith(fakePassageId, question, 'incorrect response', false);
      });
    });

    describe('when the grammar activity was not generated from a passage', function () {
      beforeEach(function () {
        question = new Question({response: 'incorrect response', body: ['correct response']});
      });

      it('does nothing', function () {
        grammarActivity.submitAnswer(question);
        expect(localStorageSpy).not.to.have.been.called;
      });
    });
  });
});
