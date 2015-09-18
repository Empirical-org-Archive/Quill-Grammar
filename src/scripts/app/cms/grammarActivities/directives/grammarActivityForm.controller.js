'use strict';

module.exports =

  /*
   * This directive expects grammarActivity, grammarActivity.question_set,
   * and processGrammarActivityForm to be set in scope. The use cases here
   * are the create grammar activity and edit grammar activity controller
   * modules.
   */

/*@ngInject*/
function GrammarActivityFormCtrl (
  $scope, _, ThemeService, ConceptService,
  StandardService, StandardLevelService, ConceptsFBService
) {
  if (_.isUndefined($scope.grammarActivity) || !_.isObject($scope.grammarActivity)) {
    throw new Error('Please define grammarActivity object in controller scope');
  } else if (_.isUndefined($scope.grammarActivity.question_set) || !_.isArray($scope.grammarActivity.question_set)) {
    throw new Error('Please define grammarActivity.question_set array in controller scope');
  }

  if (_.isUndefined($scope.processGrammarActivityForm) || !_.isFunction($scope.processGrammarActivityForm)) {
    throw new Error('Please define processGrammarActivityForm function in controller scope');
  }
  $scope.grammarActivityTemplate = require('../models/grammar.activity.js');
  $scope.grammarActivityQuestionSetTemplate = require('../models/question.set.js');

  $scope.concepts = {};

  ThemeService.get().then(function (themes) {
    $scope.themes = themes;
  });

  ConceptService.get().then(function (concepts) {
    $scope.concepts.concept_level_2 = concepts.concept_level_2;
    $scope.concepts.concept_level_1 = concepts.concept_level_1;
  });

  ConceptsFBService.get().then(function (level0Concepts) {
    $scope.concepts.concept_level_0 = level0Concepts;
  });

  StandardService.get().then(function (standards) {
    $scope.standards = standards;
  });

  StandardLevelService.get().then(function (standardLevels) {
    $scope.standard_levels = standardLevels;
  });

  $scope.removeQuestionFromSet = function (qs) {
    if ($scope.grammarActivity.question_set) {
      $scope.grammarActivity.question_set = _.without(
        $scope.grammarActivity.question_set, qs
      );
    }
  };
  $scope.addAnotherQuestionToSet = function () {
    $scope.grammarActivity.question_set.push({});
  };
};
