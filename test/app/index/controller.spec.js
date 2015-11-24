/* jshint expr:true */
'use strict';

describe('IndexController', function () {
  beforeEach(module('quill-grammar.index'));
  beforeEach(module('test.fixtures.firebase'));
  beforeEach(module('empirical-angular'));

  var $rootScope,
      $controller,
      ConceptsFBService,
      scope,
      TypingSpeed;

  beforeEach(inject(function (_$rootScope_,
    _$controller_, _ConceptsFBService_, setupMockFirebaseData, _TypingSpeed_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    ConceptsFBService = _ConceptsFBService_;
    $controller = _$controller_;
    TypingSpeed = _TypingSpeed_;
    setupMockFirebaseData();
    $controller('index', {
      $scope: scope
    });
    ConceptsFBService.ref.flush();
    $rootScope.$digest();
  }));

  it('displays the first question from the first concept', function () {
    expect(scope.currentQuestion).to.be.ok;
  });
});
