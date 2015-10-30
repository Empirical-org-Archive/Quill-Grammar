/* global browser */
/* global element */
/* global protractor */
/* global by */
/* global e */

'use strict';

function waitForTableToLoad() {
  var EC = protractor.ExpectedConditions;
  var e = element(by.css('tbody tr:first-child'));
  browser.wait(EC.presenceOf(e), 10000);
}

describe('The concept table page', function () {
  it('should be able to authenticate and redirect back to the page', function () {
    browser.get('http://localhost:3001/cms/concepts/');

    var emailInput = browser.driver.findElement(by.id('user_email'));
    emailInput.sendKeys('admin');

    var passwordInput = browser.driver.findElement(by.id('user_password'));
    passwordInput.sendKeys('admin');  //you should not commit this to VCS

    var signInButton = browser.driver.findElement(by.name('commit'));
    signInButton.click();

    expect(browser.getTitle()).toEqual('http://localhost:3001/cms/concepts');
  });

  it('should have rows in the table', function () {
    waitForTableToLoad();
    expect(e.isPresent()).toBeTruthy();
  });

  it('should be able to search the list', function () {
    browser.get('http://localhost:3001/cms/concepts/');

    waitForTableToLoad();

    var searchInput = element(by.model('searchConcept'));
    searchInput.sendKeys('428');

    var rows = element.all(by.css('tbody tr'));
    expect(rows.count()).toEqual(1);
  });

  it('should be sortable by clicking on the table header', function () {
    browser.get('http://localhost:3001/cms/concepts/');

    waitForTableToLoad();

    var topRow = element(by.css('tbody tr:first-child'));
    var bottomRow = element(by.css('tbody tr:last-child'));
    expect(topRow).not.toEqual(bottomRow);

    var button = element(by.css('th:first-child a'));
    button.click();

    var newTopRow = element(by.css('tbody tr:first-child'));
    expect(newTopRow).not.toEqual(bottomRow);
  });
});
