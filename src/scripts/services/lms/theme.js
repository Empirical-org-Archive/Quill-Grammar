'use strict';

module.exports =
angular.module('quill-grammar.services.lms.theme', [
])
.factory('ThemeService', function ($timeout) {
  this.get = function () {
    return $timeout(function () {
      return [
        {
          uid: 'theme-uid-1',
          title: 'Theme1'
        }, {
          uid: 'theme-uid-2',
          title: 'Theme2'
        }, {
          uid: 'theme-uid-3',
          title: 'Theme3'
        }
      ];
    }, 200);
  };
  return this;
});
