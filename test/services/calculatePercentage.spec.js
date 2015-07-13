'use strict';

describe.only('calculatePercentageService', function () {
  beforeEach(module('quill-grammar.services.calculatePercentage'))

  beforeEach(inject(function (_calculatePercentageService_) {
    calculatePercentageService = _calculatePercentageService_;
  }))


  it('test setup is valid', function (){
    expect(true).to.eq(true)
  })

  it('calculates percentage', function () {
    var percentage = calculatePercentageService();
    expect(percentage).to.eq(0.6);
  })
})