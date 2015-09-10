'use strict';

module.exports =

/*@ngInject*/
function ConceptsCmsCtrl (
  $scope, ConceptsFBService, _
) {
  ConceptsFBService.get().then(function (c) {
    $scope.concepts = c;
    console.log(c);
  });

  $scope.getQuestionLength = function (questions) {
    return _.keys(questions).length;
  };

  $scope.getTotalConcepts = function(concepts) {
    return _.keys(concepts).length;
  };

  $scope.getTotalQuestions = function(concepts) {
    return _.reduce(concepts, function(sum, c) {

      if (_.isNaN(sum)) {
        sum = 0;
      }
      return Number(sum) + Number(_.keys(c.questions).length);
    });
  };
};
