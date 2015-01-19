'use strict';

module.exports =
angular.module('quill-grammar.services.rule', [
  require('./crud.js').name,
  require('./ruleQuestion.js').name,
  require('./classification.js').name,
])

.factory('RuleService', function(
  CrudService,
  RuleQuestionService,
  $q,
  ClassificationService
) {
  var crud = new CrudService('rules', [
    'title', 'description', 'ruleNumber', 'classification'
  ]);
  this.saveRule = function(rule) {
    return ClassificationService.getClassificationIdByString(rule.classification)
      .then(function(cid) {
        rule.classification = cid;
        return crud.save(rule);
      }, function(error){
        return error;
      });
  };
  this.deleteRule = function (rule) {
    return crud.del(rule);
  };

  this.getRules = function(ruleIds) {
    var d = $q.defer();
    var promises = [];
    angular.forEach(ruleIds, function(value, id) {
      promises.push(crud.get(id));
    });

    function getRuleQuestionsForRules(rules) {
      var rqp = $q.defer();
      var ruleQuestionPromises = [];
      angular.forEach(rules, function(rule) {
        ruleQuestionPromises.push(
          RuleQuestionService.getRuleQuestions(rule.ruleQuestions)
        );
      });
      $q.all(ruleQuestionPromises).then(function(ruleQuestions) {
        angular.forEach(rules, function(rule, index) {
          rule.resolvedRuleQuestions = ruleQuestions[index];
        });
        rqp.resolve(rules);
      }, function(errors) {
        rqp.reject(errors);
      });
      return rqp.promise;
    }

    function getClassificationForRules(rules) {
      var cfr = $q.defer();
      var cls = [];
      angular.forEach(rules, function(rule) {
        cls.push(ClassificationService.getClassification(rule.classification));
      });
      $q.all(cls).then(function(classifications) {
        angular.forEach(rules, function(rule, index) {
          if (rule && classifications[index]) {
            rule.resolvedClassification = classifications[index];
          }
        });
        cfr.resolve(rules);
      }, function(error){
        console.log(error);
        cfr.resolve(rules);
      });
      return cfr.promise;
    }

    $q.all(promises)
    .then(getRuleQuestionsForRules)
    .then(getClassificationForRules)
    .then(function(rules){
      d.resolve(rules);
    }, function(error){
      d.reject(error);
    });
    return d.promise;
  };
  return this;
});
