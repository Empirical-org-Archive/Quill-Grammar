'use strict';

module.exports =
angular.module('quill-grammar.services.lms.topicCategory', [
])
.factory('TopicCategoryService', function (empiricalBaseURL, $http) {
  var url = empiricalBaseURL + '/topic_categories';

  this.get = function () {
    return $http.get(url).then(function (response) {
      return response.data.topic_categories;
    });
  };
  return this;
});
