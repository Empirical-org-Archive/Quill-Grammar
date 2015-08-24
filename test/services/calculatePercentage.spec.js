'use strict';

describe('calculatePercentageService', function () {
  beforeEach(module('quill-grammar.services.calculatePercentage'));

  var calculatePercentageService;

  beforeEach(inject(function (_calculatePercentageService_) {
    calculatePercentageService = _calculatePercentageService_;
  }));

  it('calculates a percentage', function () {
    var fakeConceptResultsList = [
      {concept_uid: 'foo', metadata: { correct: 1} },
      {concept_uid: 'bar', metadata: { correct: 0} }
    ];

    var fakePfResults = [
      {
        conceptClass: 'cool',
        correct: 2,
        total: 3
      },
      {
        conceptClass: 'very cool',
        correct: 0,
        total: 5
      }
    ];

    var percentage = calculatePercentageService(fakeConceptResultsList, fakePfResults);
    expect(percentage).to.eq(0.3);
  });
});
