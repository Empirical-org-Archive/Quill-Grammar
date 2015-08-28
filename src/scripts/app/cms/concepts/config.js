'use strict';
module.exports =
/*@ngInject*/
function configure ($stateProvider) {
  $stateProvider
  .state('cms-concepts', {
    parent: 'cms-concepts-base',
    templateUrl: 'concepts.cms.html',
    controller: 'ConceptsCmsCtrl',
    url: '?/'
  })
  .state('cms-concepts-base', {
    parent: 'cms',
    templateUrl: 'concepts.cms.base.html',
    contoller: 'ConceptsCmsCtrl',
    url: '/concepts',
    abstract: true
  })
  .state('cms-concepts-create', {
    parent: 'cms-concepts-base',
    templateUrl: 'concepts.create.cms.html',
    controller: 'ConceptsCreateCmsCtrl',
    url: '/create'
  })
  .state('cms-concepts-view', {
    parent: 'cms-concepts-base',
    templateUrl: 'concepts.view.cms.html',
    controller: 'ConceptsViewCmsCtrl',
    url: '/:id'
  })
  .state('cms-concepts-questions-create', {
    parent: 'cms-concepts-base',
    templateUrl: 'concepts.questions.create.cms.html',
    controller: 'ConceptsQuestionsCreateCmsCtrl',
    url: '/:conceptId/questions/create'
  })
  .state('cms-concepts-questions-edit', {
    parent: 'cms-concepts-base',
    templateUrl: 'concepts.questions.edit.cms.html',
    controller: 'ConceptsQuestionsEditCmsCtrl',
    url: '/:conceptId/questions/:conceptQuestionId'
  });
};
