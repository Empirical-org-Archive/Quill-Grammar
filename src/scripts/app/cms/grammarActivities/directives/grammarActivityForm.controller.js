'use strict';

module.exports =

  /*
   * This directive expects grammarActivity, grammarActivity.concepts,
   * and processGrammarActivityForm to be set in scope. The use cases here
   * are the create grammar activity and edit grammar activity controller
   * modules.
   */

/*@ngInject*/
function GrammarActivityFormCtrl (
  $scope, _, TopicCategoryService, ConceptService,
  StandardService, StandardLevelService, ConceptsFBService
) {
  if (_.isUndefined($scope.grammarActivity) || !_.isObject($scope.grammarActivity)) {
    throw new Error('Please define grammarActivity object in controller scope');
  } else if (_.isUndefined($scope.grammarActivity.concepts) || !_.isArray($scope.grammarActivity.concepts)) {
    if (!_.isObject($scope.grammarActivity.concepts)) {
      throw new Error('Please define grammarActivity.concepts array in controller scope');
    }
  }

  if (_.isUndefined($scope.processGrammarActivityForm) || !_.isFunction($scope.processGrammarActivityForm)) {
    throw new Error('Please define processGrammarActivityForm function in controller scope');
  }
  $scope.grammarActivityTemplate = require('../models/grammar.activity.js');
  $scope.grammarActivityQuestionSetTemplate = require('../models/question.set.js');

  $scope.concepts = {};

  TopicCategoryService.get().then(function (topicCategories) {
    $scope.topicCategories = topicCategories;
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
    if ($scope.grammarActivity.concepts) {
      $scope.grammarActivity.concepts = _.without(
        $scope.grammarActivity.concepts, qs
      );
    }
  };
  $scope.addAnotherQuestionToSet = function () {
    $scope.grammarActivity.concepts.push({});
  };
};
