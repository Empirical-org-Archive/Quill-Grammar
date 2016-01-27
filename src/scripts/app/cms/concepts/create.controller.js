'use strict';

module.exports =

/*@ngInject*/
function ConceptsCreateCmsCtrl (
  $scope, ConceptsFBService, ConceptService, $state
) {
  $scope.concept = {};

  $scope.processConceptForm = function () {
    ConceptService.post({concept: {name: $scope.concept.name, parent_uid: $scope.concept.concept_level_1.uid}}).then(function (res) {
      $scope.concept.concept_level_0 = {name: res.data.concept.name,
                                        id: res.data.concept.id,
                                        uid: res.data.concept.uid,
                                        parent_id: res.data.concept.parent_id,
                                        level: 0
                                        };
      ConceptsFBService.add($scope.concept).then(function () {
        $state.go('cms-concepts');
        return;
      }, function (error) {
        console.error(error);
      });
    });
  };
};
