'use strict';

module.exports =

  /*
   * This directive expects conceptQuestion and processconceptQuestionForm
   * to be set in scope.
   */

/*@ngInject*/
function ConceptQuestionFormCtrl (
  $scope, _
) {
  if (_.isUndefined($scope.conceptQuestion) || !_.isObject($scope.conceptQuestion)) {
    throw new Error('Please define conceptQuestion object in controller scope');
  } else if (_.isUndefined($scope.conceptQuestion.answers) || !_.isArray($scope.conceptQuestion.answers)) {
    throw new Error('Please define conceptQuestion.answers array in controller scope');
  }

  if (_.isUndefined($scope.processConceptQuestionForm) || !_.isFunction($scope.processConceptQuestionForm)) {
    throw new Error('Please define processConceptQuestionForm function in controller scope');
  }
  $scope.conceptQuestionTemplate = require('../models/conceptQuestion.js');
  $scope.conceptQuestionAnswerTemplate = require('../models/conceptQuestionAnswer.js');

  $scope.removeAnswerFromConceptQuestion = function (a) {
    if ($scope.conceptQuestion.answers) {
      $scope.conceptQuestion.answers = _.without(
        $scope.conceptQuestion.answers, a
      );
    }
  };

  $scope.addAnotherAnswerToConceptQuestion = function () {
    $scope.conceptQuestion.answers.push({});
  };
};
