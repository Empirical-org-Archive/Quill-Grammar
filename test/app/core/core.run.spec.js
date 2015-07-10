/* jshint expr:true */

'use strict';

describe('core module run', function () {
  var sandbox, firebaseAuthService;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  // This is needed for testing the module's run block
  // See: https://medium.com/@a_eife/testing-config-and-run-blocks-in-angularjs-1809bd52977e
  beforeEach(module('quill-grammar.core', function ($provide) {
    $provide.value('QuillFirebaseAuthService', {
      authenticate: sandbox.spy()
    });
  }));

  beforeEach(inject(function (_QuillFirebaseAuthService_) {
    firebaseAuthService = _QuillFirebaseAuthService_;
  }));

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  it('authenticates with the firebase service', function () {
    expect(firebaseAuthService.authenticate).to.have.been.called;
  });
});
