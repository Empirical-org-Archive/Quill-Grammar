'use strict';

module.exports =

/*@ngInject*/
function GrammarActivitiesCreateCmsCtrl (
  $scope
) {
  $scope.grammarActivity = {};
  $scope.grammarActivity.question_set = [{}];

  $scope.processGrammarActivityForm = function () {
    console.log('Processing ', $scope.grammarActivity);
  };
};
