'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-practice-questions', {
    parent: 'cms',
    templateUrl: 'practiceQuestions.cms.html',
    contoller: 'PracticeQuestionsCmsCtrl',
    url: '/practiceQuestions'
  });
};
