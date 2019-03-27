import { LoginPage } from './login.po';
import { browser } from 'protractor';
import { DisputePage } from './dispute.po';
import { IssuePage } from './issue.po';
import { DocumentPage } from './document.po';

describe('Login', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should login successfully using auth0', () => {
    page.visitPage();
    page.waitForLoadAuth0Page();
    page.waitLoginWithGoogle();

    page.fillUsername('testuser@miso.legal');
    page.fillPassword('GS`9>%zhW8rZNh\\V');
    page.login();
    page.logged();

    page.waitForRedirect();
    expect(page.getBrandText()).toBe('MISO');

  });
});
describe('Dispute', () => {
  let page: DisputePage;

  beforeEach(() => {
    page = new DisputePage();
  });
  it('should create dispute success', () => {
    page.waitDisputePage();
    page.onClickNewDispute();
    page.fillDisputeName('test');
    page.onClickCreate();
    page.waitForRedirectCreate();
  });

  it('should rename dispute success', () => {
    page.onClickMenu();
    page.onClickRename();
    page.renameDispute();
    page.onClickedRename();
    page.waitForRedirectRename();
  });
  it('should delete dispute success', () => {
    page.onClickMenu();
    page.onClickDelete();
    page.onClickedDelete();
  });

  it('should create dispute success', () => {
    page.waitDisputePage();
    page.onClickNewDispute();
    page.fillDisputeName('test');
    page.onClickCreate();
    page.waitForRedirectCreate();
  });

  it('should link issue page', () => {
    page.onClickedDispute();
    page.waitForRedirectIssue();
  });
});
describe('Issue', () => {
  let page: IssuePage;

  beforeEach(() => {
    page = new IssuePage();
    browser.waitForAngular();
  });
  it('should create issue success', () => {
    page.waitIssuePage();
    page.onClickNewIssue();
    page.fillIssueName('issue 1');
    page.onClickCreate();
    page.waitForRedirectCreate1();

    page.onClickNewIssue();
    page.fillIssueName('issue 2');
    page.onClickCreate();
    page.waitForRedirectCreate2();

    page.onClickNewIssue();
    page.fillIssueName('issue 3');
    page.onClickCreate();
    page.waitForRedirectCreate3();

  });

  // it('should drop and dragg', () => {
  //   page.dropAndDrag();
  // });

  it('should rename issue success', () => {
    page.onClickMenu();
    page.onClickRename();
    page.renameIssue();
    page.onClickedRename();
    page.waitForRedirectRename();
  });

  it('should add notes issue success', () => {
    page.onClickMenu();
    page.onClickAddNotes();
    page.fillNotes();
    page.onClickedSave();

  });

  it('should delete issue success', () => {
    page.onClickMenu();
    page.onClickDelete();
    page.onClickedDelete();
  });

  it('should link document page', () => {
    page.onClickDocument();
    page.waitForRedirectDoc();
  });
});
// describe('Document', () => {
//   let page: DocumentPage;
//
//   beforeEach(() => {
//     page = new DocumentPage();
//   });
//   it('should upload document success', () => {
//     page.waitDocumentPage();
//     page.onClickUpload();
//   });
// });
