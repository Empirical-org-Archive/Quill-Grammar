'use strict';

describe('GrammarActivity', function () {
  beforeEach(module('quill-grammar.services.firebase.grammarActivity'));

  var GrammarActivity,
      fakeGrammarActivityData,
      fakeGrammarActivityId,
      RuleService,
      $rootScope,
      $q,
      sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function (_GrammarActivity_, _$rootScope_, _RuleService_, _$q_) {
      GrammarActivity = _GrammarActivity_;
      $rootScope = _$rootScope_;
      RuleService = _RuleService_;
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

  describe('.fromRuleIds', function () {
    it('builds a custom grammar activity from a set of rule numbers', function (done) {
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
      GrammarActivity.fromRuleIds([1, 2, 3]).then(function (customGrammarActivity) {
        expect(customGrammarActivity.rules).to.deep.equal(expectedActivityData.rules);
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
});
