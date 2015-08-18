'use strict';

module.exports =
angular.module('quill-grammar.services.lms.standard', [
])
.factory('StandardService', function ($timeout) {
  this.get = function () {
    return $timeout(function () {
      return [
        {
          uid: 'standard-uid-1',
          title: 'standard1'
        }, {
          uid: 'standard-uid-2',
          title: 'standard2'
        }, {
          uid: 'standard-uid-3',
          title: 'standard3'
        }
      ];
    }, 200);
  };
  return this;
});
