'use strict';

describe('calculatePercentageService', function () {
  beforeEach(module('quill-grammar.services.calculatePercentage'));

  var calculatePercentageService;

  beforeEach(inject(function (_calculatePercentageService_) {
    calculatePercentageService = _calculatePercentageService_;
  }));

  it('calculates a percentage', function () {
    var fakeConceptResultsList = [
      {concept_uid: 'foo', metadata: {correct: 1}},
      {concept_uid: 'bar', metadata: {correct: 0}}
    ];

    var percentage = calculatePercentageService(fakeConceptResultsList);
    expect(percentage).to.eq(0.5);
  });
});
