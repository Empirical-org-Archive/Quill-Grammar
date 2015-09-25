'use strict';

/*@ngInject*/
module.exports =

function StandardsDirectiveCtrl (
  $scope, StandardService, StandardLevelService
) {
  StandardService.get().then(function (standards) {
    $scope.standards = standards;
  });

  StandardLevelService.get().then(function (standardLevels) {
    $scope.standardLevels = standardLevels;
  });
};
