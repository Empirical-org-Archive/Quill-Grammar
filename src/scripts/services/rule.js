'use strict';

module.exports =
angular.module('quill-grammar.services.rule', [
  require('./crud.js').name,
  require('./ruleQuestion.js').name,
])

.factory('RuleService', function (
  CrudService,
  RuleQuestionService,
  $q,
  _
) {
  var crud = new CrudService('rules', [
    'title', 'description', 'ruleNumber', 'classification', 'ruleQuestions'
  ], 'cms');

  this.updateRule = function (rule) {
    return crud.update(rule);
  };

  this.saveRule = function (rule) {
    function getClassification(rule) {
      return ClassificationService.getClassificationIdByString(rule.classification)
        .then(function (cid) {
          rule.classification = cid;
          return rule;
        }, function (error) {
          return error;
        });
    }

    function addRuleNumber(rule) {
      var ruleNumber = new CrudService('ruleNumberCounter', [], 'cms').getRef();
      ruleNumber.$transaction(function (currentRuleNumber) {
        if (!currentRuleNumber) {
          return 1;
        }
        if (currentRuleNumber < 0) {
          return;
        }
        return currentRuleNumber + 1;
      }).then(function (snapshot) {
        if (snapshot === null) {
          d.reject(new Error('current rule number error: snapshot null'));
        } else {
          rule.ruleNumber = snapshot.val();
          d.resolve(rule);
        }
      }, function (error) {
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
    return crud.del(rule).then(function () {
      return CategoryService.removeRuleFromCategory(category, rule);
    });
  };

  this.getAllRules = function () {
    return crud.all();
  };

  this.removeRuleQuestionFromRule = function (rule, question) {
    if (!rule || !rule.ruleQuestions) {
      throw new Error('rule does not have any ruleQuestions to remove');
    }
    _.each(rule.ruleQuestions, function (r, key) {
      if (key === question.$id) {
        rule.ruleQuestions[key] = null;
      }
    });
    return crud.update(rule);
  };

  this.getRules = function (ruleIds) {
    var d = $q.defer();
    var promises = _.map(ruleIds, function (id, key) {
      if (!_.isArray(ruleIds)) {
        id = key;
      }
      return crud.get(id);
    });

    function getRuleQuestionsForRules(rules) {
      var rqp = $q.defer();
      var ruleQuestionPromises = [];
      _.each(rules, function (rule) {
        ruleQuestionPromises.push(
          RuleQuestionService.getRuleQuestions(rule.ruleQuestions)
        );
      });
      $q.all(ruleQuestionPromises).then(function (ruleQuestions) {
        _.each(rules, function (rule, index) {
          rule.resolvedRuleQuestions = ruleQuestions[index];
        });
        rqp.resolve(rules);
      }, function (errors) {
        rqp.reject(errors);
      });
      return rqp.promise;
    }

    function getClassificationForRules(rules) {
      var cfr = $q.defer();
      var cls = [];
      _.each(rules, function (rule) {
        cls.push(ClassificationService.getClassification(rule.classification));
      });
      $q.all(cls).then(function (classifications) {
        _.each(rules, function (rule, index) {
          if (rule && classifications[index]) {
            rule.resolvedClassification = classifications[index];
          }
        });
        cfr.resolve(rules);
      }, function (error) {
        console.log(error);
        cfr.resolve(rules);
      });
      return cfr.promise;
    }

    $q.all(promises)
    .then(getRuleQuestionsForRules)
    .then(getClassificationForRules)
    .then(function (rules) {
      d.resolve(rules);
    }, function (error) {
      d.reject(error);
    });
    return d.promise;
  };
  return this;
});
