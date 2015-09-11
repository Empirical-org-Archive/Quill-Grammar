'use strict';

(function (angular) {
  var concept1Id = 'abc789ghi';
  var concept2Id = 'def123iop';

  var concept1RuleNumber = 123;
  var concept2RuleNumber = 456;

  var concept1Question1Id = 'question-1-fixture-uid';

  var concept1Json = {
    concept_level_0: {
      name: 'You\'re',
      uid: '9gB_Y50t1a3w33SMASSorQ'
    },
    concept_level_1: {},
    concept_level_2: {},
    questions: {},
    ruleNumber: concept1RuleNumber
  };

  var concept1Question1Json = {
    answers: [
      {text: 'Tom ironed his shirt because it was {wrinkly}.'}
    ],
    instructions: 'Rewrite the sentence',
    prompt: 'Tom ironed his shirt because it was <u>wrinkle</u>.'
  };

  concept1Json.questions[concept1Question1Id] = concept1Question1Json;

  var concept2Json = {
    concept_level_0: {},
    concept_level_1: {},
    concept_level_2: {},
    questions: {},
    ruleNumber: concept2RuleNumber
  };

  var allConcepts = {};
  allConcepts[concept1Id] = concept1Json;
  allConcepts[concept2Id] = concept2Json;

  var grammarActivity1Id = 'abcdef123';

  var grammarActivityJson = {
    concepts: {},
    title: 'Grammar Activity 1 Title'
  };

  grammarActivityJson.concepts[concept1Id] = {
    quantity: 1,
    ruleNumber: concept1RuleNumber
  };
  grammarActivityJson.concepts[concept2Id] = {
    quantity: 2,
    ruleNumber: concept2RuleNumber
  };

  var allGrammarActivities = {};
  allGrammarActivities[grammarActivity1Id] = grammarActivityJson;

  angular.module('test.fixtures.firebase', [
      'quill-grammar.config',
      'quill-grammar.services.firebase.grammarActivity',
      'quill-grammar.services.firebase.concepts'
    ])
    .value('grammarActivityJson', grammarActivityJson)
    .value('grammarActivity1Id', grammarActivity1Id)
    .value('concept1RuleNumber', concept1RuleNumber)
    .value('concept2RuleNumber', concept2RuleNumber)
    .value('concept1Question1Json', concept1Question1Json)
    .value('concept1Json', concept1Json)
    .value('allConceptsJson', allConcepts)
    .service('setupMockFirebaseData', function (GrammarActivity, ConceptsFBService) {
      function setup() {
        var grammarActivityRef = GrammarActivity.ref;
        grammarActivityRef.set(allGrammarActivities);
        grammarActivityRef.flush();

        var conceptRef = ConceptsFBService.ref;
        conceptRef.set(allConcepts);
        conceptRef.flush();
      }
      return setup;
    });
})(angular);
