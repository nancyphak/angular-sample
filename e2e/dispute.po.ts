import { browser, by, element, protractor } from 'protractor';

const EC = protractor.ExpectedConditions;

export class DisputePage {
  createDisputeButton = element(by.css('.action-button'));
  disputeName = element(by.css('h3'));
  btnMenu = element(by.css('.mat-icon-button.mat-button'));

  waitDisputePage() {
    browser.wait(EC.elementToBeClickable(this.createDisputeButton), 10000);
    browser.waitForAngular();
    browser.sleep(500);
  }

  onClickNewDispute() {
    this.createDisputeButton.click();
  }

  fillDisputeName(disputeName) {
    const text = element(by.css('.mat-input-element'));
    text.sendKeys(disputeName);
  }

  onClickCreate() {
    const submitBtn = element(by.css('.mat-raised-button.mat-primary'));
    submitBtn.click();
  }

  waitForRedirectCreate() {
    browser.sleep(5000);
    expect(this.disputeName.getText()).toBe('test');
    expect(true).toBe(true);
  }

  onClickMenu() {
    this.btnMenu.click();
    browser.sleep(500);
  }

  onClickRename() {
    const btnRename = element(by.cssContainingText('.mat-menu-item', 'Rename'));
    btnRename.click();
    browser.sleep(5000);
  }

  renameDispute() {
    const inputRename = element(by.name('title'));
    inputRename.clear();
    inputRename.sendKeys('rename test');
    browser.sleep(500);
  }

  onClickedRename() {
    const clickedBtnRename = element(by.css('.mat-raised-button.mat-primary'));
    clickedBtnRename.click();
  }

  waitForRedirectRename() {
    browser.sleep(10000);
    expect(this.disputeName.getText()).toBe('rename test');
    expect(true).toBe(true);
  }

  onClickDelete() {
    const btnDelete = element(by.cssContainingText('.mat-menu-item', 'Delete'));
    btnDelete.click();
    browser.sleep(1000);
  }

  onClickedDelete() {
    const clickedBtnDelete = element(by.cssContainingText('.mat-button', 'Delete'));
    clickedBtnDelete.click();
    browser.sleep(1000);
  }

  onClickedDispute() {
    const clickedDispute = element(by.css('mat-list-item'));
    clickedDispute.click();
  }

  waitForRedirectIssue() {
    browser.wait(() => {
      return browser.driver.getCurrentUrl().then((url) => {
        return (url.indexOf('/issues') >= 0);
      });
    }, 50000);
  }

  getBrandText() {
    const brandText = element(by.css('h1'));
    return brandText.getText();
  }
}
