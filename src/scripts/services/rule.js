'use strict';

module.exports =
angular.module('quill-grammar.services.rule', [
  require('./crud.js').name,
  require('./ruleQuestion.js').name,
  require('./classification.js').name,
])

.factory('RuleService', function(
  CrudService,
  CategoryService,
  RuleQuestionService,
  $q,
  ClassificationService
) {
  var crud = new CrudService('rules', [
    'title', 'description', 'ruleNumber', 'classification'
  ]);
  this.saveRule = function(rule) {
    function getClassification(rule) {
      return ClassificationService.getClassificationIdByString(rule.classification)
        .then(function(cid) {
          rule.classification = cid;
          return rule;
        }, function(error){
          return error;
        });
    }

    function addRuleNumber(rule) {
      var ruleNumber = new CrudService('ruleNumberCounter').getRef();
      ruleNumber.$transaction(function(currentRuleNumber) {
        if (!currentRuleNumber) {
          return 1;
        }
        if (currentRuleNumber < 0) {
          return;
        }
        return currentRuleNumber + 1;
      }).then(function(snapshot) {
        if (snapshot === null) {
          d.reject(new Error('current rule number error: snapshot null'));
        } else {
          rule.ruleNumber = snapshot.val();
          d.resolve(rule);
        }
      }, function(error){
        d.reject(error);
      });
      var d = $q.defer();
      return d.promise;
    }

    return getClassification(rule)
      .then(addRuleNumber)
      .then(crud.save);
  };
  this.deleteRule = function (category, rule) {
    return crud.del(rule).then(function() {
      return CategoryService.removeRuleFromCategory(category, rule);
    });
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
