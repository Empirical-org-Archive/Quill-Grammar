'use strict';

module.exports =
angular.module('quill-grammar.services.flags', [
  require('./crud.js').name,
])

.factory('FlagService', function(CrudService) {
  var crud = new CrudService('flags', [], 'cms');
  var fs = this;
  fs.saveFlag = function(flag) {
    return crud.save(flag);
  };
  fs.deleteFlag = function (flag) {
    return crud.del(flag);
  };
  fs.getFlag = function(flagId) {
    return crud.get(flagId);
  };

  fs.getFlags = function() {
    return crud.all();
  };

  return fs;
});
