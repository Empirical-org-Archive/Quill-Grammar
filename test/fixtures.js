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

  var proofreaderActivity1Json = {
    description: 'Proofread a passage and try to find all errors.',
    flag: 'alpha',
    instructions: '<br>There are <b>6 errors</b> in this story.  <br><br> <i>How many can you correct?</i><br><br>To  edit a word, click on it and re-type it.<br><br>',
    passage: 'The man and his daughter thanked the sun and went to speak with the cloud. "Cloud,"  the man asked, {+"Will-"will|497} you marry my daughter?"<br/><br/>The cloud laughed  and said, "I am stronger than the sun, but the wind is even more powerful than  I am. The wind pushes me this way and that way, so I must go where he blows me.  If your daughter wants a strong husband, she should {+marry-mary|222} the wind."<br/><br/>The  father turned to his daughter and asked, {+"Daughter,-"daughter,|497} do you think  the wind would make a good husband for you?"<br/><br/>The daughter exclaimed, "Yes,  Father! {+Let’s-Lets|232} go talk to the wind."<br/><br/>The father then said to  the wind, "Wind, will you marry my daughter?"<br/><br/>The wind scoffed at the man  and said, "I used to think I was very strong, but now I know better. Do you see  that stone wall over there? I have been blowing and blowing against that wall for  many years, but it {+won’t-wont|440} fall down. The wall is much stronger {+than-then|272}  me."<br/>',
    title: 'A Man and His Mouse (Mythology) - Part 4',
    underlineErrorsInProofreader: false
  };

  var proofreaderActivity1Id = 'defghi789';

  var allProofreadingActivities = {};
  allProofreadingActivities[proofreaderActivity1Id] = proofreaderActivity1Json;

  angular.module('test.fixtures.firebase', [
      'quill-grammar.config',
      'quill-grammar.services.firebase.grammarActivity',
      'quill-grammar.services.firebase.proofreaderActivity',
      'quill-grammar.services.firebase.concepts'
    ])
    .value('grammarActivityJson', grammarActivityJson)
    .value('grammarActivity1Id', grammarActivity1Id)
    .value('concept1RuleNumber', concept1RuleNumber)
    .value('concept2RuleNumber', concept2RuleNumber)
    .value('concept1Question1Json', concept1Question1Json)
    .value('concept1Json', concept1Json)
    .value('allConceptsJson', allConcepts)
    .value('proofreaderActivity1Id', proofreaderActivity1Id)
    .value('proofreaderActivity1Json', proofreaderActivity1Json)
    .service('setupMockFirebaseData', function (GrammarActivity, ConceptsFBService, ProofreaderActivity) {
      function setup() {
        var grammarActivityRef = GrammarActivity.ref;
        grammarActivityRef.set(allGrammarActivities);
        grammarActivityRef.flush();

        var proofreaderActivityRef = ProofreaderActivity.ref;
        proofreaderActivityRef.set(allProofreadingActivities);
        proofreaderActivityRef.flush();

        var conceptRef = ConceptsFBService.ref;
        conceptRef.set(allConcepts);
        conceptRef.flush();
      }
      return setup;
    });
})(angular);
