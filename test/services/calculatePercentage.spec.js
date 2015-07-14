'use strict';

describe('calculatePercentageService', function () {
  beforeEach(module('quill-grammar.services.calculatePercentage'))

  var calculatePercentageService
  beforeEach(inject(function (_calculatePercentageService_) {
    calculatePercentageService = _calculatePercentageService_;
  }))


  it('test setup is valid', function (){
    expect(true).to.eq(true)
  })

  it('calculates percentage', function () {
    var conceptTagResults = [
      {correct: 0},
      {correct: 1}
    ]

    var percentage = calculatePercentageService(conceptTagResults);
    expect(percentage).to.eq(0.5);
  })
})