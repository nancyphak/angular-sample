import {
  DisputeRoute,
  EvidencesRoute,
  IssuesRoute,
  PeopleRoute,
  DocumentsRoute,
  PleadingsRoute,
  EventsRoute
} from '../../mockapi/routes';

describe('Facts page', () => {
  const disputeFixture = DisputeRoute.findDisputesByUser().response;
  const evidencesFixture = EvidencesRoute.findEvidenceByDispute().response;
  const firstDispute = disputeFixture[0];
  const pageUrl = `disputes/${firstDispute.id}/facts/issues`;

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

    it('Should be able show the list evidences', () => {
      cy.url().should('include', pageUrl);

      const displayedItems = cy.get('[data-cy="nameEvidence"]');
      displayedItems.should('have.length', evidencesFixture.length);

      cy.window().then((window: any) => {
        const event = new Event('commitState');
        window.dispatchEvent(event);
      });
    });

    it('Should drag facts 01 into list issue', () => {
      cy.route(EvidencesRoute.updateEvidence()).as('postUpdateEvidence');
      const evidenceToDrag = evidencesFixture[0];
      const issue = {
        id: 'd932fe27-7ba5-49b5-9323-ee12241df686',
        name: 'issue 1'
      };

      cy.get('[data-cy="draggableEvidence"]').first().trigger('cdkDragStarted', {force: true});
      cy.get('[data-cy="dropEvidence"]').first().trigger('cdkDropListDropped', {
        force: true,
        item: {data: evidenceToDrag}
      });

      cy.wait('@postUpdateEvidence').then($res => {
        const updatedEvidence = evidenceToDrag;
        const issueIdsInEvidence = [...evidenceToDrag.issueIds];
        issueIdsInEvidence.unshift(issue.id);

        expect($res.requestBody).to.deep.eq({
          EvidenceId: updatedEvidence.id,
          Text: updatedEvidence.text,
          PageNumber: updatedEvidence.pageNumber,
          DocumentId: updatedEvidence.documentId,
          IssueIds: issueIdsInEvidence,
          DisputeId: updatedEvidence.disputeId
        });
      });
      cy.get('[data-cy="nameIssueChip"]').first().should(($p) => {
        expect($p).to.contain('issue 1');
      });
    });

    it('Should be able to remove a evidence (The first item of the list)', () => {
      cy.route(EvidencesRoute.deleteEvidence()).as('postRemoveEvidence');

      const evidenceToDelete = evidencesFixture[0];

      cy.get('[data-cy="removeEvidence"]').first().click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRemoveEvidence').then($res => {
        expect($res.requestBody).to.deep.eq({
          DisputeId: evidenceToDelete.disputeId,
          EvidenceId: evidenceToDelete.id
        });
      });
      cy.get('[data-cy="nameEvidence"]').should('not.have.value', evidenceToDelete.text);
    });

    it('Should be able to remove issue from fact', () => {
      cy.route(EvidencesRoute.updateEvidence()).as('postUpdateEvidence');

      const evidenceToUpdate = evidencesFixture[0];
      const issueIdsInEvidence = evidencesFixture[0].issueIds;

      cy.get('[data-cy="removeIssueChip"]').first().click();

      cy.wait('@postUpdateEvidence').then($res => {
        expect($res.requestBody).to.deep.eq({
          EvidenceId: evidenceToUpdate.id,
          Text: evidenceToUpdate.text,
          PageNumber: evidenceToUpdate.pageNumber,
          DocumentId: evidenceToUpdate.documentId,
          IssueIds: issueIdsInEvidence.splice(1, 1),
          DisputeId: evidenceToUpdate.disputeId
        });
      });
      cy.get('[data-cy="nameIssueChip"]').should('not.have.value', 'issue 2');
    });

    it('Should be able drag facts 01 into issue 1 detail', () => {
      cy.route(EvidencesRoute.updateEvidence()).as('postUpdateEvidence');

      const evidenceToDrag = evidencesFixture[0];
      const issue = {
        id: 'd932fe27-7ba5-49b5-9323-ee12241df686',
        name: 'issue 1'
      };

      cy.get('[data-cy="issueItem"]').should('be.visible').first().click({force: true});
      cy.get('[data-cy="draggableEvidence"]').first().trigger('cdkDragStarted');
      cy.get('[data-cy="issueDetail"]').trigger('cdkDropListDropped', {
        force: true,
        item: {data: evidenceToDrag}
      });

      cy.wait('@postUpdateEvidence').then($res => {
        const updatedEvidence = evidenceToDrag;
        const issueIdsInEvidence = [...evidenceToDrag.issueIds];
        issueIdsInEvidence.unshift(issue.id);

        expect($res.requestBody).to.deep.eq({
          EvidenceId: updatedEvidence.id,
          Text: updatedEvidence.text,
          PageNumber: updatedEvidence.pageNumber,
          DocumentId: updatedEvidence.documentId,
          IssueIds: issueIdsInEvidence,
          DisputeId: updatedEvidence.disputeId
        });
      });

      cy.get('[data-cy="nameIssueChip"]').first().should(($p) => {
        expect($p).to.contain(issue.name);
      });
    });

    it('should be able navigate to that issue in the sidekick', () => {
      const issue = {
        id: evidencesFixture[0].issueIds[0]
      };

      cy.get('[data-cy="nameIssueChip"]').first().click();
      cy.url().should('include', issue.id);
    });

    it('Should be able to click person chip', () => {
      const firstPersonAssociatedWithFact = {
        id: '05a6deb8-70cc-4933-acbb-ce75c70a4ea1',
        name: 'David de Gea'
      };
      cy.get('[data-cy="namePersonChip"]').first().click();
      cy.url().should('include', firstPersonAssociatedWithFact.id);

      cy.get('[data-cy="namePerson"]').should(($p) => {
        expect($p.first()).to.contain(firstPersonAssociatedWithFact.name);
      });
    });

  });
  context('Empty Data', () => {
    beforeEach(function () {
      cy.server();
      cy.route(DisputeRoute.findDisputesByUser()).as('getDisputes');
      cy.route(IssuesRoute.findIssuesByDispute()).as('getIssues');
      cy.route(EvidencesRoute.findEvidencesByDisputeAndReturnEmpty()).as('getEmptyEvidences');
      cy.route(PeopleRoute.findPeopleByDispute()).as('getPeople');
      cy.route(DocumentsRoute.listDocumentFiles()).as('getDocuments');
      cy.route(DocumentsRoute.findDocumentMetadataByDispute()).as('getDocumentMetadata');
      cy.route(PleadingsRoute.findPleadingsByDisputeAndReturnEmpty()).as('getPleadings');
      cy.route(EventsRoute.findChronologyEventsByDispute()).as('getEvents');
      cy.addAuthTokenAndVisit(pageUrl);
    });

    it('Should be able to show empty page when get empty response', function () {
      cy.wait('@getEmptyEvidences').then((res: any) => {
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
