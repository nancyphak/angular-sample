import { browser, by, element, protractor } from 'protractor';

const EC = protractor.ExpectedConditions;


export class IssuePage {
  btnNewIssue = element(by.css('.mat-raised-button.mat-accent'));
  issueName = element(by.css('.issue-label'));
  btnMenu = element(by.id('menu'));

  waitIssuePage() {
    browser.wait(EC.elementToBeClickable(this.btnNewIssue), 10000);
    browser.waitForAngular();
    browser.sleep(500);
  }

  onClickNewIssue() {
    this.btnNewIssue.click();
  }

  fillIssueName(issueName) {
    const text = element(by.css('.mat-input-element'));

    text.sendKeys(issueName);
  }

  onClickCreate() {
    const submitBtn = element(by.css('.mat-raised-button.mat-primary'));

    submitBtn.click();
  }

  waitForRedirectCreate1() {
    browser.sleep(5000);
    expect(this.issueName.getText()).toBe('issue 1');
    expect(true).toBe(true);
  }

  waitForRedirectCreate2() {
    browser.sleep(5000);
    expect(this.issueName.getText()).toBe('issue 2');
    expect(true).toBe(true);

  }
  waitForRedirectCreate3() {
    browser.sleep(5000);
    expect(this.issueName.getText()).toBe('issue 3');
    expect(true).toBe(true);

  }

  dropAndDrag() {
    const drag = element(by.id('issue 3'));
    const drop = element(by.cssContainingText('.issue-label.parent-drop-zone', 'issue 1'));

    browser.actions().dragAndDrop(drag, drop).perform();
    browser.sleep(5000);
  }

  onClickMenu() {
    this.btnMenu.click();
    browser.sleep(1000);

  }

  onClickRename() {
    const btnRename = element(by.cssContainingText('.mat-menu-item', 'Rename'));

    browser.waitForAngular();
    btnRename.click();
    browser.sleep(1000);
  }

  renameIssue() {
    const inputRename = element(by.name('title'));

    inputRename.clear();
    inputRename.sendKeys('rename issue');
    browser.sleep(500);
  }

  onClickedRename() {
    const clickedBtnRename = element(by.css('.mat-raised-button.mat-primary'));

    clickedBtnRename.click();
  }

  waitForRedirectRename() {
    browser.sleep(5000);
    expect(this.issueName.getText()).toBe('rename issue');
    expect(true).toBe(true);
  }


  onClickAddNotes() {
    const btnAddNotes = element(by.cssContainingText('.mat-menu-item', 'Add Notes'));

    btnAddNotes.click();
  }

  fillNotes() {
    const inputNotes = element(by.name('notes'));
    inputNotes.sendKeys('Some thing');
  }

  onClickedSave() {
    const save = element(by.cssContainingText('span', 'Save'));
    save.click();
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

  onClickDocument() {
    const clickedTabDoc = element(by.cssContainingText('.mat-tab-link', 'DOCUMENT'));
    clickedTabDoc.click();
    browser.sleep(5000);
  }

  waitForRedirectDoc() {
    browser.wait(() => {
      return browser.driver.getCurrentUrl().then((url) => {
        return (url.indexOf('/documents') >= 0);
      });
    }, 50000);
  }
  getBrandText() {
    const brandText = element(by.css('h1'));
    return brandText.getText();
  }

}
