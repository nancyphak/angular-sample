import { browser, by, element, protractor } from 'protractor';

const EC = protractor.ExpectedConditions;

export class LoginPage {

  usernameField = element(by.name('email'));
  passwordField = element(by.name('password'));
  loginButton = element(by.css('.auth0-label-submit'));
  loginWithGoogle = element(by.css('button'));
  brandText = element(by.css('.brand__text'));
  loggedButton = element(by.css('.auth0-lock-social-button.auth0-lock-social-big-button'));

  visitPage() {
    browser.waitForAngularEnabled(false);
    return browser.get('/');
  }

  fillUsername(username) {
    this.usernameField.sendKeys(username);
  }

  fillPassword(password) {
    this.passwordField.sendKeys(password);
  }

  login() {
    this.loginButton.click();
  }
  logged() {
    browser.sleep(10000);
    this.loggedButton.click();
  }

  waitForLoadAuth0Page() {
    browser.wait(() => {
      return browser.driver.getCurrentUrl().then((url) => {
        return (url.indexOf('auth0.com') >= 0);
      });
    }, 50000);
  }

  waitLoginWithGoogle() {
    browser.wait(EC.elementToBeClickable(this.loginWithGoogle), 100000);
  }

  waitForRedirect() {
    browser.wait(() => {
      return browser.driver.getCurrentUrl().then((url) => {
        return (url.indexOf('/disputes') >= 0);
      });
    }, 50000);
  }

  getBrandText() {
    return this.brandText.getText();
  }
}

