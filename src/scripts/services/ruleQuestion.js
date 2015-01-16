'use strict';

module.exports =
angular.module('quill-grammar.services.ruleQuestion', [
  require('./crud.js').name,
])

.factory('RuleQuestionService', function(CrudService, $q) {
  var crud = new CrudService('ruleQuestions');
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
    $q.all(promises).then(function(ruleQuestions) {
      d.resolve(ruleQuestions);
    }, function(error) {
      d.reject(error);
    });
    return d.promise;
  };
  return this;
});
