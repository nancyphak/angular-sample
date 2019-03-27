import {
  DisputeRoute,
  IssuesRoute,
  EvidencesRoute,
  PeopleRoute,
  DocumentsRoute,
  PleadingsRoute,
  EventsRoute,
} from '../../mockapi/routes';

describe('Issues preview item', function () {
  const disputeFixture = DisputeRoute.findDisputesByUser().response;
  const issuesFixture = IssuesRoute.findIssuesByDispute().response;
  const firstDispute = disputeFixture[0];
  const firstIssue = issuesFixture[0];
  const pageUrl = `disputes/${firstDispute.id}/issues/${firstIssue.id}`;
  const topMinHeightIssueNotes = 100;
  const maxHeightAutoIssueNotes = 200;
  const separatorHeight = 18;
  const reg = new RegExp('{enter}', 'g');

  context('Valid Data', () => {
    before(() => {
      cy.definedRoute();
      cy.addAuthTokenAndVisit(pageUrl);
    });

    beforeEach(() => {
      cy.server();
    });

    afterEach(() => {
      cy.window().then((window) => {
        const event = new Event('resetState');
        window.dispatchEvent(event);
      });
    });

    it('Should be able to show the first issue', () => {
      cy.url().should('include', pageUrl);

      cy.get('[data-cy="input-text"]').first().should('have.value', issuesFixture[0].name);

      cy.window().then((window: any) => {
        const event = new Event('commitState');
        window.dispatchEvent(event);
      });
    });

    it('Should be able to set notes height', () => {
      cy.get('[data-cy="issueNotes"]').first().should('have.css', 'height', issuesFixture[0].notesHeightPreference + 'px');
    });

    it('Should be able to set notes height for issue having empty notes', () => {
      cy.get('[data-cy="issueItem"]').should('be.visible').eq(1).click();

      cy.get('[data-cy="issueNotes"]').first().should('have.css', 'height', topMinHeightIssueNotes + 'px');

      cy.get('[data-cy="issueItem"]').should('be.visible').eq(0).click();
    });

    it('Should be able to set notes height for issue having long notes and not having notesHeightPreference', () => {
      cy.get('[data-cy="issueItem"]').should('be.visible').eq(2).click();

      cy.get('[data-cy="issueNotes"]').first().should('have.css', 'height', maxHeightAutoIssueNotes + 'px');

      cy.get('[data-cy="issueItem"]').should('be.visible').eq(0).click();
    });

    it('Should be able to drag and change notes height', () => {
      cy.route(IssuesRoute.setIssueNotesHeight()).as('setIssueNotesHeight');

      const x = 100;
      const y = 100;
      const expectHeight = (issuesFixture[0].notesHeightPreference + y - separatorHeight / 2);

      cy.get('[data-cy="panesSeparator"]').should('be.visible')
        .trigger('mousedown', {which: 1})
        .trigger('mousemove', x, y, {
          which: 1,
          force: true
        })
        .trigger('mouseup', {force: true});

      cy.get('[data-cy="issueNotes"]').first().should('have.css', 'height', expectHeight + 'px');
      cy.wait('@setIssueNotesHeight').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: issuesFixture[0].disputeId,
          issueId: issuesFixture[0].id,
          height: expectHeight
        });
      });
    });

    it('Should be able to reset notes height when resetting notes', () => {
      cy.route(IssuesRoute.setIssueNotes()).as('setIssueNotes');
      cy.route(IssuesRoute.setIssueNotesHeight()).as('setIssueNotesHeight');

      cy.get('[data-cy="text-area"]').should('be.visible').first().click().clear().blur();
      cy.get('[data-cy="issueNotes"]').first().should('have.css', 'height', topMinHeightIssueNotes + 'px');

      cy.wait('@setIssueNotes').then($res => {
        expect($res.requestBody).to.deep.eq({
          DisputeId: issuesFixture[0].disputeId,
          IssueId: issuesFixture[0].id,
          Notes: ''
        });
      });
      cy.wait('@setIssueNotesHeight').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: issuesFixture[0].disputeId,
          issueId: issuesFixture[0].id,
          height: 0
        });
      });
    });

    it('Should be able to change notes height when typing', () => {
      cy.route(IssuesRoute.setIssueNotes()).as('setIssueNotes');

      cy.get('[data-cy="issueItem"]').should('be.visible').eq(1).click();

      const newNotes = 'abc{enter}abc{enter}abc';
      cy.get('[data-cy="text-area"]').should('be.visible').first().click().clear().type(newNotes).blur();
      cy.get('[data-cy="issueNotes"]').first().should((div) => {
        expect(div[0].clientHeight).greaterThan(topMinHeightIssueNotes).lessThan(maxHeightAutoIssueNotes);
      });

      cy.wait('@setIssueNotes').then($res => {
        expect($res.requestBody).to.deep.eq({
          DisputeId: issuesFixture[1].disputeId,
          IssueId: issuesFixture[1].id,
          Notes: newNotes.replace(reg, '\n')
        });
      });

      cy.get('[data-cy="issueItem"]').should('be.visible').eq(0).click();
    });

    it('Should be able to change notes height to maximum when typing long text', () => {
      cy.route(IssuesRoute.setIssueNotes()).as('setIssueNotes');

      cy.get('[data-cy="issueItem"]').should('be.visible').eq(1).click();

      const newNotes = 'abc{enter}abc{enter}abc{enter}abc{enter}abc{enter}abc{enter}abc{enter}abc{enter}abc{enter}abc{enter}abc';
      cy.get('[data-cy="text-area"]').should('be.visible').first().click().clear().type(newNotes).blur();
      cy.get('[data-cy="issueNotes"]').first().should((div) => {
        expect(div[0].clientHeight).equal(maxHeightAutoIssueNotes);
      });

      cy.wait('@setIssueNotes').then($res => {
        expect($res.requestBody).to.deep.eq({
          DisputeId: issuesFixture[1].disputeId,
          IssueId: issuesFixture[1].id,
          Notes: newNotes.replace(reg, '\n')
        });
      });

      cy.get('[data-cy="issueItem"]').should('be.visible').eq(0).click();
    });
  });
  context('Empty Data', () => {

    beforeEach(function () {
      cy.server();
      cy.route(DisputeRoute.findDisputesByUser()).as('getDisputes');
      cy.route(IssuesRoute.findIssuesByDisputeAndReturnEmpty()).as('getEmptyIssues');
      cy.route(EvidencesRoute.findEvidenceByDispute()).as('getEvidences');
      cy.route(PeopleRoute.findPeopleByDispute()).as('getPeople');
      cy.route(DocumentsRoute.listDocumentFiles()).as('getDocuments');
      cy.route(DocumentsRoute.findDocumentMetadataByDispute()).as('getDocumentMetadata');
      cy.route(PleadingsRoute.findParagraphsByDispute()).as('getPleadings');
      cy.route(EventsRoute.findChronologyEventsByDispute()).as('getEvents');
      cy.addAuthTokenAndVisit(pageUrl);
    });

    it('Should be able to show empty page when get empty response', function () {

      cy.wait('@getEmptyIssues').then((res: any) => {
        if (res) {
          const responseItems = res.responseBody;

          expect(responseItems.length).to.eq(0);
          cy.get('[data-cy="headerLonely"]').should(($p) => {
            expect($p.first()).to.contain(`It's lonely in here!`);
          });
        }
      });
    });
  });
});
