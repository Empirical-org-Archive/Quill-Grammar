/* jshint expr:true */
'use strict';

describe('GrammarActivity', function () {
  beforeEach(module('quill-grammar.services.firebase.grammarActivity'));

  var GrammarActivity,
      fakeGrammarActivityData,
      fakeGrammarActivityId,
      RuleService,
      Question,
      SentenceLocalStorage,
      $rootScope,
      $q,
      sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function (_GrammarActivity_, _$rootScope_, _RuleService_, _$q_, _Question_, _SentenceLocalStorage_) {
      GrammarActivity = _GrammarActivity_;
      $rootScope = _$rootScope_;
      RuleService = _RuleService_;
      Question = _Question_;
      SentenceLocalStorage = _SentenceLocalStorage_;
      $q = _$q_;
    });

    // FIXME: As part of the migration to the new data format #148,
    // the structure of this fake activity should be changed to match
    // the new data format. Failing tests will point to areas that
    // need fixing.
    fakeGrammarActivityData = {
      rules: [
        {
          quantity: 1,
          ruleId: 123
        },
        {
          quantity: 2,
          ruleId: 456
        }
      ]
    };

    fakeGrammarActivityId = 'abcdef123';
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  describe('.fromPassageResults', function () {
    it('builds a custom grammar activity from a set of rule numbers and a passage ID', function (done) {
      var fakePassageId = 'abcdef6789';
      var expectedActivityData = {
        rules: [
          {
            quantity: 3,
            ruleId: 1
          },
          {
            quantity: 3,
            ruleId: 2
          },
          {
            quantity: 3,
            ruleId: 3
          }
        ]
      };
      GrammarActivity.fromPassageResults([1, 2, 3], fakePassageId).then(function (customGrammarActivity) {
        expect(customGrammarActivity.rules).to.deep.equal(expectedActivityData.rules);
        expect(customGrammarActivity.passageId).to.equal(fakePassageId);
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('#getById', function () {
    it('loads the activity data from firebase', function (done) {
      GrammarActivity.ref.child(fakeGrammarActivityId).set(fakeGrammarActivityData);
      GrammarActivity.getById(fakeGrammarActivityId).then(function (activity) {
        expect(activity.rules[0]).to.deep.equal(fakeGrammarActivityData.rules[0]);
        done();
      });
      $rootScope.$digest();
      GrammarActivity.ref.flush();
      $rootScope.$digest();
    });
  });

  describe('#getQuestions', function () {
    // FIXME: This data format will break when fixing #148.
    var fakeRules = [
      {
        ruleNumber: 123,
        resolvedRuleQuestions: [
          {
            hint: 'rule 123 question 1',
            prompt: 'No prompt'
          },
          {
            hint: 'rule 123 question 2',
            prompt: 'Another prompt'
          }
        ]
      },
      {
        ruleNumber: 456,
        resolvedRuleQuestions: [
          {
            hint: 'rule 456 question 1',
            prompt: 'No prompt'
          },
          {
            hint: 'rule 456 question 2',
            prompt: 'Another prompt'
          }
        ]
      }
    ];

    beforeEach(function () {
      sandbox.mock(RuleService)
        .expects('getRules')
        .withArgs([123, 456])
        .returns($q.when(fakeRules));
    });

    it('loads a sample of questions for the correct rule IDs and questions', function (done) {
      var grammarActivity = new GrammarActivity(fakeGrammarActivityData);
      grammarActivity.getQuestions().then(function (questions) {
        expect(questions).to.have.length(3);
        done();
      });
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
