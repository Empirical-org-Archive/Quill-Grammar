/* jshint expr:true */

'use strict';

describe('core module run', function () {
  var sandbox,
      firebaseAuthService,
      quillOAuthService,
      $rootScope,
      $state;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  // This is needed for testing the module's run block
  // See: https://medium.com/@a_eife/testing-config-and-run-blocks-in-angularjs-1809bd52977e
  beforeEach(module('quill-grammar.core', function ($provide, $stateProvider) {
    $provide.value('QuillFirebaseAuthService', {
      authenticate: sandbox.spy()
    });
    $provide.value('QuillOAuthService', {
      isAuthenticated: sandbox.stub(),
      authenticate: sandbox.stub()
    });

    $stateProvider.state('state-requiring-oauth', {
      url: '/foobar?uid&student&anonymous',
      data: {
        authenticateUser: true
      }
    });
  }));

  beforeEach(inject(function (_QuillFirebaseAuthService_, _$rootScope_, _$state_, QuillOAuthService) {
    firebaseAuthService = _QuillFirebaseAuthService_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    quillOAuthService = QuillOAuthService;
  }));

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  it('authenticates with the firebase service', function () {
    expect(firebaseAuthService.authenticate).to.have.been.called;
  });

  describe('$stateChangeStart event', function () {
    describe('when the new state requires OAuth authentication', function () {
      it('checks the authenticated state', function () {
        $rootScope.$broadcast('$stateChangeStart', $state.get('state-requiring-oauth'), {});
        expect(quillOAuthService.isAuthenticated).to.have.been.called;
      });

      it('authenticates if necessary', function () {
        quillOAuthService.isAuthenticated.returns(false);
        $rootScope.$broadcast('$stateChangeStart', $state.get('state-requiring-oauth'), {});
        expect(quillOAuthService.authenticate).to.have.been.called;
      });

      it('does not authenticate if not necessary', function () {
        quillOAuthService.isAuthenticated.returns(true);
        $rootScope.$broadcast('$stateChangeStart', $state.get('state-requiring-oauth'), {});
        expect(quillOAuthService.authenticate).not.to.have.been.called;
      });

      describe('when the anonymous flag has been passed', function () {
        it('does not try to authenticate the user', function () {
          quillOAuthService.isAuthenticated.returns(false);
          $rootScope.$broadcast('$stateChangeStart', $state.get('state-requiring-oauth'), {anonymous: 'true'});
          expect(quillOAuthService.authenticate).not.to.have.been.called;
        });
      });
    });
  });
});
