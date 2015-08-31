'use strict';

module.exports =
angular.module('quill-grammar.services.lms.concept', [
  'underscore',
  require('../../../../.tmp/config').name,
])
/*@ngInject*/
.factory('ConceptService', function (empiricalBaseURL, $http) {
  var url = empiricalBaseURL + '/concepts';

  this.get = function () {
    return $http.get(url).then(function (response) {
      var concepts = response.data.concepts;
      var accumulator = {concept_level_0: [],
                         concept_level_1: [],
                         concept_level_2: []};
      return _.reduce(concepts, function (acc, concept) {
        switch (concept.level) {
          case 0: {
            acc.concept_level_0.push(concept);
            break;
          }
          case 1: {
            acc.concept_level_1.push(concept);
            break;
          }
          case 2: {
            acc.concept_level_2.push(concept);
            break;
          }
        }
        return acc;
      }, accumulator);
    });
  };
  return this;
});
