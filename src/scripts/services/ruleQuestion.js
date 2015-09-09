'use strict';

module.exports =
angular.module('quill-grammar.services.ruleQuestion', [
  require('./crud.js').name,
  require('./instruction.js').name,
  require('./v2/question.js').name,
])

.factory('RuleQuestionService', function (
  CrudService, InstructionService, $q, _, Question
) {
  var crud = new CrudService('ruleQuestions', [
    'body', 'hint', 'instructions', 'prompt',
    'conceptTag', 'conceptClass', 'conceptCategory'
  ], 'cms');

  this.ref = crud.getRef();

  this.saveRuleQuestion = function (ruleQuestion) {
    return crud.save(ruleQuestion);
  };
  this.deleteRuleQuestion = function (ruleQuestion) {
    return crud.del(ruleQuestion);
  };

  function getInstructionForRuleQuestion(ruleQuestions) {
    var insp = $q.defer();
    var ins = [];
    _.each(ruleQuestions, function (rq) {
      ins.push(InstructionService.getInstruction(rq.instructions));
    });
    $q.all(ins).then(function (instructions) {
      _.each(ruleQuestions, function (rq, index) {
        rq.resolvedInstructions = instructions[index].$value;
      });
      insp.resolve(ruleQuestions);
    }, function (errors) {
      insp.reject(errors);
    });
    return insp.promise;
  }

  this._getAllRuleQuestionsWithInstructions = function () {
    return crud.all().then(function (ruleQuestionsData) {
      return _.map(ruleQuestionsData, function (rqData) {
        return new Question(rqData);
      });
    }).then(getInstructionForRuleQuestion);
  };

  this.getRuleQuestions = function (ruleQuestionIds) {
    var d = $q.defer();
    var promises = _.map(ruleQuestionIds, function (id, key) {
      if (!_.isArray(ruleQuestionIds)) {
        id = key;
      }
      return crud.get(id);
    });

    $q.all(promises)
    .then(getInstructionForRuleQuestion)
    .then(function (ruleQuestionsData) {
      var ruleQuestions = _.map(ruleQuestionsData, function (rqData) {
        return new Question(rqData);
      });
      d.resolve(ruleQuestions);
    }, function (error) {
      d.reject(error);
    });
    return d.promise;
  };
  return this;
});
