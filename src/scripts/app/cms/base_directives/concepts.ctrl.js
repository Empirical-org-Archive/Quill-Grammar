'use strict';

/*@ngInject*/
module.exports =

function ConceptsDirectiveCtrl(
  ConceptService, ConceptsFBService, $scope, _
) {
  $scope.concepts = {};
  ConceptService.get().then(function (concepts) {
    $scope.concepts.concept_level_2 = concepts.concept_level_2;
    $scope.concepts.concept_level_1 = concepts.concept_level_1;
  });

  ConceptsFBService.get().then(function (level0Concepts) {
    $scope.concepts.concept_level_0 = level0Concepts;
  });

  /*
   * Check to see if the client has provided the level
   * of concept to show. If they've not provided a levels
   * variable we assume that all concept levels are allowed.
   */
  $scope.hasLevel = function(level) {
    if ($scope.levels && _.isArray($scope.levels)) {
      return _.contains($scope.levels, level);
    } else {
      return true;
    }
  };
};
