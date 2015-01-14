'use strict';

module.exports =
angular.module('quill-grammar.services.rule', [
  require('./crud.js').name,
])

.factory('RuleService', function(CrudService, $q) {
  var crud = new CrudService('rules');
  this.saveRule = function(rule) {
    return crud.save(rule);
  };
  this.deleteRule = function (rule) {
    return crud.del(rule);
  };

  this.getRules = function(ruleIds) {
    var promises = [];
    angular.forEach(ruleIds, function(id) {
      promises.push(crud.get(id));
    });
    return $q.all(promises);
  };
  return this;
});
