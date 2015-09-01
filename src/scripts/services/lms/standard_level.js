'use strict';

module.exports =
angular.module('quill-grammar.services.lms.standard_level', [
  require('../../../../.tmp/config').name,
])
.factory('StandardLevelService', function (empiricalBaseURL, $http) {
  var url = empiricalBaseURL + '/sections';

  this.get = function () {
    return $http.get(url).then(function (response) {
      return response.data.sections;
    });
  };
  return this;
});
