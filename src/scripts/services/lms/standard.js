'use strict';

module.exports =
angular.module('quill-grammar.services.lms.standard', [
  require('../../../../.tmp/config').name,
])
.factory('StandardService', function (empiricalBaseURL, $http) {
  var url = empiricalBaseURL + '/topics';

  this.get = function () {
    return $http.get(url).then(function (response) {
      return response.data.topics;
    });
  };
  return this;
});
