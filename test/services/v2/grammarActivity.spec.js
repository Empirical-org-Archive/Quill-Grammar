/* jshint expr:true */
'use strict';

describe('GrammarActivity', function () {
  beforeEach(module('quill-grammar.services.firebase.grammarActivity'));
  beforeEach(module('test.fixtures.firebase'));

  var GrammarActivity,
      ConceptsFBService,
      grammarActivityJson,
      concept1Json,
      grammarActivity1Id,
      RuleService,
      Question,
      SentenceLocalStorage,
      $rootScope,
      $q,
      sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function (_GrammarActivity_,
      _$rootScope_, _RuleService_, _$q_, _Question_, _SentenceLocalStorage_,
      _grammarActivityJson_, setupMockFirebaseData,
      _ConceptsFBService_, _concept1Json_, _grammarActivity1Id_) {
      GrammarActivity = _GrammarActivity_;
      ConceptsFBService = _ConceptsFBService_;
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
      concept1Question1Json;
    beforeEach(inject(function (_concept1RuleNumber_, _concept2RuleNumber_, _concept1Question1Json_) {
      concept1RuleNumber = _concept1RuleNumber_;
      concept2RuleNumber = _concept2RuleNumber_;
      concept1Question1Json = _concept1Question1Json_;
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
        localStorageSpy;

    // FIXME: This is commented out for the time being because
    // the concept UID is not properly associated with the
    // question.
    // it('saves a concept result to firebase', function () {
    //we only need to communicate with the LMS for non-anonymous sessions
    // if ($scope.sessionId) {
    // FIXME: conceptUid is not a field on the ruleQuestion. How can we get to the point where this works?
    // ConceptResult.saveToFirebase($scope.sessionId, crq.conceptUid, {
    //   answer: answer,
    //   correct: correct ? 1 : 0
    // });
    // }
    // });

    beforeEach(function () {
      localStorageSpy = sandbox.stub(SentenceLocalStorage, 'storeTempResult');
    });

    describe('when the grammar activity was generated from a passage', function () {
      beforeEach(function () {
        fakePassageId = 'abcdef123';
        grammarActivity = new GrammarActivity({passageId: fakePassageId});
        question = new Question({response: 'incorrect response', body: ['correct response']});
      });

      it('saves temporary results to local storage', function () {
        grammarActivity.submitAnswer(question);
        expect(localStorageSpy).to.have.been.calledWith(fakePassageId, question, 'incorrect response', false);
      });
    });

    describe('when the grammar activity was not generated from a passage', function () {
      beforeEach(function () {
        grammarActivity = new GrammarActivity({});
        question = new Question({response: 'incorrect response', body: ['correct response']});
      });

      it('does nothing', function () {
        grammarActivity.submitAnswer(question);
        expect(localStorageSpy).not.to.have.been.called;
      });
    });
  });
});
