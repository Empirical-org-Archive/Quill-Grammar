'use strict';

module.exports =

/*@ngInject*/
function ConceptsCmsCtrl (
  $scope, ConceptsFBService, _
) {
  ConceptsFBService.get().then(function (c) {
    $scope.concepts = c;
  });

  $scope.getQuestionLength = function (questions) {
    return _.keys(questions).length;
  };
};
