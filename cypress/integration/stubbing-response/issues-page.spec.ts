import {
  DisputeRoute,
  EvidencesRoute,
  IssuesRoute,
  PeopleRoute,
  DocumentsRoute,
  PleadingsRoute,
  EventsRoute
} from '../../mockapi/routes';

describe('Issues page', function () {
  const disputeFixture = DisputeRoute.findDisputesByUser().response;
  const issuesFixture = IssuesRoute.findIssuesByDispute().response;
  const firstDispute = disputeFixture[0];
  const firstIssue = issuesFixture[0];
  const pageUrl = `disputes/${firstDispute.id}/issues/${firstIssue.id}`;

  context('Valid Data', () => {
    before(() => {
      cy.definedRoute();
      cy.route(DocumentsRoute.downloadDocument()).as('downloadDocument');
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

    it('Should be able show the list issues', function () {
      cy.url().should('include', pageUrl);

      const displayedItems = cy.get('[data-cy="nameIssue"]');
      displayedItems.should('have.length', issuesFixture.length);

      cy.window().then((window: any) => {
        const event = new Event('commitState');
        window.dispatchEvent(event);
      });
    });

    it('Should be able to create a issue', function () {
      cy.route(IssuesRoute.createIssue()).as('postCreateIssue');

      const issueName = 'issues test';

      cy.get('[data-cy="createIssue"]').first().click();
      cy.get('[data-cy="inputTitle"]').type(issueName);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postCreateIssue').then(($res: any) => {
        const issue = $res.requestBody;
        expect(issue.name).to.eq(issueName);
      });
      cy.get('[data-cy="nameIssue"]').should(($p) => {
        expect($p.first()).to.contain(issueName);
      });
    });

    it('Should be able to rename a issue', function () {
      cy.route(IssuesRoute.renameIssue()).as('postRenameIssue');

      const issueToRename = issuesFixture[0];
      const newName = 'rename-issue-01';

      cy.get('[data-cy="input-text"]').first().click();
      cy.get('[data-cy="input-text"]').first().clear().type(newName);
      cy.get('[data-cy="input-text"]').first().blur();
      cy.wait('@postRenameIssue').then($res => {
        expect($res.requestBody).to.deep.eq({
          id: issueToRename.id,
          disputeId: issueToRename.disputeId,
          newName: newName,
        });
      });
      cy.get('[data-cy="nameIssue"]').first().should(($p) => {
        expect($p).to.contain(newName);
      });
    });

    it('should be able to remove a issue', function () {
      cy.route(IssuesRoute.deleteIssue()).as('postRemoveIssue');

      const issueToDelete = issuesFixture[0];

      cy.get('[data-cy="menuIssue"]').first().click();
      cy.get('[data-cy="removeIssue"]').click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRemoveIssue').then($res => {
        expect($res.requestBody).to.deep.eq({
          DisputeId: issueToDelete.disputeId,
          Id: issueToDelete.id,
        });
      });
      cy.get('[data-cy="issueName"]').should('not.have.value', issueToDelete.name);
    });

    it('should drag issue 3 under issue 5', function () {
      cy.route(IssuesRoute.setIssuePosition()).as('postSetIssuePosition');

      const issueDrag = issuesFixture[0];
      const issueBeforeDropped = issuesFixture[4];
      const nameIssueLast = issuesFixture[3].name;
      cy.get('[data-cy="draggable"]').first().trigger('dragstart', {
        force: true,
        dataTransfer: {'test': ''}
      });

      cy.get('[data-cy="drop"]').last().trigger('drop', {force: true});
      cy.wait('@postSetIssuePosition').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: issueDrag.disputeId,
          issueId: issueDrag.id,
          afterIssueId: issueBeforeDropped.id,
          parentIssueId: ''
        });
      });
      cy.get('[data-cy="nameIssue"]').last().should(($p) => {
        expect($p).to.contain(nameIssueLast);
      });
    });

    it('Should be able remove sentence assign pleadings with issue main view', function () {
      cy.route(PleadingsRoute.removeSentencesFromIssue()).as('postRemoveSentencesFromIssue');

      const pleadingsFixture = PleadingsRoute.findParagraphsByDispute().response[0];
      const sentence = pleadingsFixture.sentences[0];
      const issueToAssign = IssuesRoute.findIssuesByDispute().response[0];
      const sentenceIds: Array<any> = [];
      sentenceIds.push(sentence.id);

      cy.get('[data-cy="menuSidekick"]').should('be.visible').click({force: true});
      cy.get('[data-cy="nameMenuSidekick"]').eq(1).click();
      cy.url().should('include', 'pleadings');

      cy.document().then((document) => {
        const selection = document.getSelection();
        const nodes = document.getElementsByClassName('sentence-highlight');

        (selection as any).setBaseAndExtent(nodes[0], 0, nodes[0], 0);
        cy.get('[data-cy="sentenceParagraph"]').first().should('be.visible').click({force: true});
      });

      cy.wait('@postRemoveSentencesFromIssue').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: pleadingsFixture.disputeId,
          sentenceIds: sentenceIds,
          issueId: issueToAssign.id
        });
      });
    });

    it('Should be able to add sentence assign pleadings with issue main view', function () {
      cy.route(PleadingsRoute.assignSentenceToIssue()).as('postAssignSentenceToIssue');

      const pleadingsFixture = PleadingsRoute.findParagraphsByDispute().response[0];
      const responseToAssign = pleadingsFixture.responses[0];
      const sentence = responseToAssign.sentences[0];
      const issueToAssign = IssuesRoute.findIssuesByDispute().response[0];
      const issueIds: Array<any> = sentence.issueIds;
      issueIds.push(issueToAssign.id);

      cy.get('[data-cy="menuSidekick"]').should('be.visible').click({force: true});
      cy.get('[data-cy="nameMenuSidekick"]').eq(1).click();
      cy.url().should('include', 'pleadings');

      cy.document().then((document) => {
        const selection = document.getSelection();
        const nodes = document.getElementsByClassName('no-highlight');

        (selection as any).setBaseAndExtent(nodes[1], 0, nodes[1], 0);
        cy.get('[data-cy="sentenceResponse"]').first().should('be.visible').click({force: true});
      });

      cy.wait('@postAssignSentenceToIssue').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: pleadingsFixture.disputeId,
          sentenceId: sentence.id,
          issueIds: issueIds
        });
      });
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
