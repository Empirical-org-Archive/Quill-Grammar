'use strict';

module.exports =
angular.module('quill-grammar.services.classification', [
  require('./crud.js').name,
])

.factory('ClassificationService', function(CrudService) {
  var crud = new CrudService('classifications');
  this.saveClassification = function(classification) {
    return crud.save(classification);
  };
  this.deleteClassification = function (classification) {
    return crud.del(classification);
  };
  this.getClassification = function(classificationId) {
    return crud.get(classificationId);
  };
  return this;
});
