'use strict';

module.exports =
angular.module('quill-grammar.services.lms.standard_level', [
])
.factory('StandardLevelService', function ($timeout) {
  this.get = function () {
    return $timeout(function () {
      return [
        {
          uid: 'standard_level-uid-1',
          title: 'standard_level1'
        }, {
          uid: 'standard_level-uid-2',
          title: 'standard_level2'
        }, {
          uid: 'standard_level-uid-3',
          title: 'standard_level3'
        }
      ];
    }, 200);
  };
  return this;
});
