'use strict';

module.exports =
angular.module('quill-grammar.services.proofreading', [
  require('./crud.js').name,
])

.factory('ProofreadingService', function(CrudService) {
  var crud = new CrudService('passageProofreadings', [
    'flagId', 'categoryId', 'instructions', 'passage', 'title', 'description'
  ], 'activities');

  this.saveProofreading = function(proofreading) {
    return crud.save(proofreading);
  };
  this.deleteProofreading = function (proofreading) {
    return crud.del(proofreading);
  };
  this.getProofreading = function(proofreadingId) {
    return crud.get(proofreadingId);
  };
  this.getAllProofreadings = function() {
    return crud.all();
  };
  return this;
});
