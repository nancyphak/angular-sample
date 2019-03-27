import { browser, by, element, protractor } from 'protractor';

const EC = protractor.ExpectedConditions;


export class DocumentPage {
  btnNew = element(by.css('.mat-raised-button.mat-accent'));

  waitDocumentPage() {
    browser.wait(EC.elementToBeClickable(this.btnNew), 5000);
    browser.waitForAngular();
  }

  onClickUpload() {
    const selectFile = element(by.cssContainingText('span', 'Select filesUploading from your device'));
    this.btnNew.click();
    browser.sleep(5000);
    selectFile.click();
    browser.sleep(10000);
  }

}
