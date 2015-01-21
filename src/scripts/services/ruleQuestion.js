'use strict';

module.exports =
angular.module('quill-grammar.services.ruleQuestion', [
  require('./crud.js').name,
  require('./instruction.js').name,
])

.factory('RuleQuestionService', function(
  CrudService, InstructionService, $q
) {
  var crud = new CrudService('ruleQuestions', [
    'body', 'hint', 'instructions', 'prompt'
  ]);
  this._getCrud = function() {
    return crud;
  };
  this.saveRuleQuestion = function(ruleQuestion) {
    return crud.save(ruleQuestion);
  };
  this.deleteRuleQuestion = function (ruleQuestion) {
    return crud.del(ruleQuestion);
  };

  this.getRuleQuestions = function(ruleQuestionIds) {
    var d = $q.defer();
    var promises = [];
    angular.forEach(ruleQuestionIds, function(value, id) {
      promises.push(crud.get(id));
    });
    function getInstructionForRuleQuestion(ruleQuestions) {
      var insp = $q.defer();
      var ins = [];
      angular.forEach(ruleQuestions, function(rq) {
        ins.push(InstructionService.getInstruction(rq.instructions));
      });
      $q.all(ins).then(function(instructions) {
        angular.forEach(ruleQuestions, function(rq, index) {
          rq.resolvedInstruction = instructions[index];
        });
        insp.resolve(ruleQuestions);
      }, function(errors) {
        insp.reject(errors);
      });
      return insp.promise;
    }
    $q.all(promises)
    .then(getInstructionForRuleQuestion)
    .then(function(ruleQuestions) {
      d.resolve(ruleQuestions);
    }, function(error) {
      d.reject(error);
    });
    return d.promise;
  };
  return this;
});
