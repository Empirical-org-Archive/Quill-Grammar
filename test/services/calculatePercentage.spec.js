'use strict';

describe('calculatePercentageService', function () {
  beforeEach(module('quill-grammar.services.calculatePercentage'));

  var calculatePercentageService;

  beforeEach(inject(function (_calculatePercentageService_) {
    calculatePercentageService = _calculatePercentageService_;
  }));

  it('calculates a percentage', function () {
    var fakeConceptTagResults = [
      {foo: 'bar', correct: 0},
      {foo: 'bar', correct: 1}
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

    var percentage = calculatePercentageService(fakeConceptTagResults, fakePfResults);
    expect(percentage).to.eq(0.3);
  });
});
