'use strict';

module.exports =
angular.module('quill-grammar.services.instruction', [
  require('./crud.js').name,
])

.factory('InstructionService', function(CrudService) {
  var crud = new CrudService('instructions', [], 'cms');
  this.saveInstruction = function(instruction) {
    return crud.save(instruction);
  };
  this.deleteInstruction = function (instruction) {
    return crud.del(instruction);
  };
  this.getInstruction = function(instructionId) {
    return crud.get(instructionId);
  };
  return this;
});
