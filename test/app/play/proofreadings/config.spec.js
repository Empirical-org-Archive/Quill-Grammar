'use strict';

describe('quill-grammar.play.proofreadings config', function () {
  beforeEach(module('quill-grammar.play.proofreadings'));

  var sandbox,
      $q,
      $rootScope,
      $state,
      $templateCache;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    inject(function (_$rootScope_, _$q_, _$state_, _$templateCache_) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $q = _$q_;
      $templateCache = _$templateCache_;
    });
  });

  afterEach(function () {
    sandbox.verifyAndRestore();
  });

  describe('routes', function() {
    describe('play route', function() {
      it('has the route', function() {
        expect($state.get('play-pf')).to.exist;
      });

      it('accepts uid, student, and anonymous params (starting activity from the LMS)', function() {
        expect($state.href('play-pf', {uid: 'foo', student: 'bar', anonymous: 'true'}))
          .to.equal('#/play/pf?uid=foo&student=bar&anonymous=true');
      });

      it('is integrated with OAuth', function() {
        expect($state.get('play-pf').data.authenticateUser).to.be.true;
      });
    });
  });
});
