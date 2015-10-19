describe('The concept table page', function(){
  it('should be able to load a question', function(){
    browser.get('http://localhost:3001/play/sw?uid=8loxjcP_fmux7lrFGonEWA&anonymous=true');
    waitForQuestionToLoad()
    var header = element(by.css('.sentence-writing-heading .left h2'));
    header.getText().then(function(t){
      expect(t).toEqual('Verb Mood Shift');
    })
  });

  it('should be able handle pressing enter as submitting an answer', function(){
    waitForQuestionToLoad();
    
    expect(element(by.buttonText('Check Work')).isPresent()).toBe(true);
    expect(element(by.buttonText('Recheck Work')).isPresent()).toBe(false);
    
    var input = element(by.model('question.response'));
    input.sendKeys(protractor.Key.ENTER);

    expect(element(by.buttonText('Recheck Work')).isPresent()).toBe(true);
  });
  
  it('should show the right prompt when submitting the correct answer', function(){
    waitForQuestionToLoad();
    
    var input = element(by.model('question.response'));
    input.sendKeys("I wish he were visiting this week, we all could have celebrated together.");
    input.sendKeys(protractor.Key.ENTER);

    expect(element(by.buttonText('Next Problem')).isPresent()).toBe(true);
  });

  it('should go to the next question when pressing enter after the correct answer', function(){
    var input = element(by.model('question.response'));
    input.sendKeys(protractor.Key.ENTER);

    var header = element(by.css('.sentence-writing-heading .left h2'));
    header.getText().then(function(t){
      expect(t).toEqual('Verb Tense Shift');
    });
  });

});


function waitForQuestionToLoad(){
  var EC = protractor.ExpectedConditions;
  var e = element(by.css('.sentence-writing-heading .left h2:first-child'));
  browser.wait(EC.textToBePresentInElement(e, 'Verb Mood Shift'), 10000);
}

