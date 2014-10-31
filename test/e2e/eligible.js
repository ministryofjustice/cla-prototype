describe('CLA: Eligible', function() {

  it('should open start page', function() {
    browser.get('http://localhost:4567/');

    expect(browser.getTitle()).toEqual('Civil Legal Aid');
    expect(element(by.css('h1')).getText()).toEqual('Can I get legal aid?');
  });

  it('should have start button', function() {
    var startButton = element(by.css('button.button'));
    expect(startButton.isPresent()).toBe(true);

    startButton.click();
  });

  it('should go to Problem page', function() {
    expect(element(by.css('h1')).getText()).toEqual('What do you need help with?');
  });

  it('should have correct number of options on Problem page', function() {
    expect(element.all(by.css('input[type="radio"]')).count()).toEqual(18);
  });

  it('should select option and go to About page', function() {
    var nextButton = element(by.css('button.button'));

    expect(nextButton.isPresent()).toBe(true);

    element(by.css('input[value="violence"]')).click();
    nextButton.click();

    expect(element(by.css('h1')).getText()).toEqual('About you');
  });

});
