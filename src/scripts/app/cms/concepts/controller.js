'use strict';

module.exports =

/*@ngInject*/
function ConceptsCmsCtrl (
  $scope, ConceptsFBService, _
) {
  $scope.sortType       = 'concept_level_2.name'; // set the default sort type
  $scope.sortReverse    = false;  // set the default sort order
  $scope.searchConcept  = '';     // set the default search/filter term
  ConceptsFBService.get().then(function (c) {
    $scope.concepts = addQuestionCountToConcepts(c);
  });

  $scope.getQuestionLength = function (questions) {
    return _.keys(questions).length;
  };

  $scope.getTotalConcepts = function (concepts) {
    return _.keys(concepts).length;
  };

  $scope.getTotalQuestions = function (concepts) {
    return _.reduce(concepts, function (sum, c) {
      if (_.isNaN(sum)) {
        sum = 0;
      }
      return Number(sum) + Number(_.keys(c.questions).length);
    });
  };

  function addQuestionCountToConcepts (concepts) {
    return _.map(concepts, function (c) {
      c.questionCount = _.keys(c.questions).length;
      return c;
    });
  };
};
