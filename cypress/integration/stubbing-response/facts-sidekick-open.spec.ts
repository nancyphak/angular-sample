import {
  DisputeRoute,
  EvidencesRoute,
  IssuesRoute,
  PeopleRoute,
  DocumentsRoute,
  PleadingsRoute,
  EventsRoute
} from '../../mockapi/routes';


describe('Facts sidekick', () => {
  const documentsFixture = DocumentsRoute.listDocumentFiles().response;
  const listEvidencesFixture = EvidencesRoute.findEvidenceByDispute().response;
  const listIsuesFixture = IssuesRoute.findIssuesByDispute().response;
  const firstDocument = documentsFixture[0];
  const pageUrl = `disputes/${firstDocument.disputeId}/documents/${firstDocument.id}/view/facts`;
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

    it('Should be able to show the list facts', () => {
      cy.url().should('include', pageUrl);

      const displayedItems = cy.get('[data-cy="evidence-item"]');
      displayedItems.should('have.length', listEvidencesFixture.length);

      cy.window().then((window: any) => {
        const event = new Event('commitState');
        window.dispatchEvent(event);
      });
    });

    it('Should be able to remove fact', () => {
      cy.route(EvidencesRoute.deleteEvidence()).as('postRemoveEvidence');

      const evidenceToDelete = listEvidencesFixture[0];

      cy.get('[data-cy="removeEvidence"]').first().click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRemoveEvidence').then($res => {
        expect($res.requestBody).to.deep.eq({
          EvidenceId: evidenceToDelete.id,
          DisputeId: evidenceToDelete.disputeId
        });
      });
      cy.get('[data-cy="evidenceText"]').should('not.have.value', evidenceToDelete.text);
    });

    it('Should be able to add fact', () => {
      cy.route(EvidencesRoute.createEvidence()).as('postCreateEvidence');

      cy.get('[data-cy="createEvidence"]').first().click();

      cy.wait('@postCreateEvidence').then(($res: any) => {
        const evidence = $res.requestBody;

        expect(evidence.Text).to.eq('');
        expect(evidence.DocumentId).to.eq(firstDocument.id);
        expect(evidence.DisputeId).to.eq(firstDocument.disputeId);
        expect(evidence.PageNumber).to.eq(1);
        expect(evidence.IssueIds.length).to.eq([].length);
      });

      const displayedItems = cy.get('[data-cy="evidence-item"]');
      displayedItems.should('have.length', listEvidencesFixture.length + 1);
    });

    it('Should be able to edit page number fact', () => {
      cy.route(EvidencesRoute.updateEvidence()).as('postUpdateEvidence');

      const pageNumber = 2;
      const evidence = listEvidencesFixture[0];
      const evidenceToEdit = {
        EvidenceId: evidence.id,
        DisputeId: evidence.disputeId,
        DocumentId: evidence.documentId,
        Text: evidence.text,
        PageNumber: pageNumber,
        IssueIds: evidence.issueIds
      };

      cy.get('[data-cy="evidencePageNumber"]').first().clear().type(pageNumber.toString());
      cy.get('[data-cy="evidencePageNumber"]').first().blur();

      cy.wait('@postUpdateEvidence').then(($res: any) => {
        expect($res.requestBody).to.deep.eq(evidenceToEdit);
      });

      cy.get('[data-cy="evidencePageNumber"]').should('have.value', pageNumber.toString());
    });

    it('Should be able to edit text fact', () => {
      cy.route(EvidencesRoute.updateEvidence()).as('postUpdateEvidence');

      const text = 'facts 01 edited';
      const evidence = listEvidencesFixture[0];
      const evidenceToEdit = {
        EvidenceId: evidence.id,
        DisputeId: evidence.disputeId,
        DocumentId: evidence.documentId,
        Text: text,
        PageNumber: evidence.pageNumber,
        IssueIds: evidence.issueIds
      };

      cy.get('[data-cy="text-area"]').first().clear().type(text);
      cy.get('[data-cy="text-area"]').first().blur();

      cy.wait('@postUpdateEvidence').then(($res: any) => {
        expect($res.requestBody).to.deep.eq(evidenceToEdit);
      });

      cy.get('[data-cy="text-area"]').first().should((data) => {
        expect(data.get()[0].textContent).to.eq(text);
      });
    });

    it('Should be able to remove issue', () => {
      cy.route(EvidencesRoute.updateEvidence()).as('postUpdateEvidence');

      const evidence = listEvidencesFixture[0];
      const issueIdToRemove = evidence.issueIds[0];
      const evidenceToEdit = {
        EvidenceId: evidence.id,
        DisputeId: evidence.disputeId,
        DocumentId: evidence.documentId,
        Text: evidence.text,
        PageNumber: evidence.pageNumber,
        IssueIds: evidence.issueIds.filter((id: string) => id !== issueIdToRemove)
      };

      const arrayLength = listEvidencesFixture.map((evidenceTemp: any) => {
        return evidenceTemp.issueIds.length;
      });

      const length = arrayLength.reduce((a, b) => a + b, 0);

      cy.get('[data-cy="removeEvidenceIssue"]').first().click();

      cy.wait('@postUpdateEvidence').then(($res: any) => {
        expect($res.requestBody).to.deep.eq(evidenceToEdit);
      });

      cy.get('[data-cy="removeEvidenceIssue"]').should('have.length', length - 1);
    });

    it('Should be able to filter fact', () => {
      cy.get('[data-cy="filterEvidence"]').first().click();
      const list = listEvidencesFixture.filter(evidence => evidence.documentId === firstDocument.id);

      const displayedItems = cy.get('[data-cy="evidence-item"]');
      displayedItems.should('have.length', list.length);

      cy.get('[data-cy="filterEvidence"]').first().click();
    });

    it('Should be able to add issue', () => {
      cy.route(EvidencesRoute.updateEvidence()).as('postUpdateEvidence');

      const evidence = listEvidencesFixture[0];
      const issueEdit = listIsuesFixture[0];
      const arrayLength = listEvidencesFixture.map((evidenceTemp: any) => {
        return evidenceTemp.issueIds.length;
      });

      let length = arrayLength.reduce((a, b) => a + b, 0);

      let issueIdsToEdit = evidence.issueIds;
      if (evidence.issueIds.includes(issueEdit.id)) {
        issueIdsToEdit = issueIdsToEdit.filter((id: string) => id !== issueEdit.id);
        length--;
      } else {
        issueIdsToEdit.push(issueEdit.id);
        length++;
      }
      const evidenceToEdit = {
        EvidenceId: evidence.id,
        DisputeId: evidence.disputeId,
        DocumentId: evidence.documentId,
        Text: evidence.text,
        PageNumber: evidence.pageNumber,
        IssueIds: issueIdsToEdit
      };

      cy.get('[data-cy="addEvidenceIssue"]').first().click();
      cy.get('[data-cy="issueItem"]').first().click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postUpdateEvidence').then(($res: any) => {
        expect($res.requestBody.EvidenceId).to.deep.eq(evidenceToEdit.EvidenceId);
        expect($res.requestBody.DisputeId).to.deep.eq(evidenceToEdit.DisputeId);
        expect($res.requestBody.DocumentId).to.deep.eq(evidenceToEdit.DocumentId);
        expect($res.requestBody.Text).to.deep.eq(evidenceToEdit.Text);
        expect($res.requestBody.PageNumber).to.deep.eq(evidenceToEdit.PageNumber);
        expect($res.requestBody.IssueIds.length).to.deep.eq(evidenceToEdit.IssueIds.length);
      });

      cy.get('[data-cy="removeEvidenceIssue"]').should('have.length', length);
    });
  });

  context('Empty Data', () => {
    beforeEach(() => {
      cy.server();
      cy.route(DisputeRoute.findDisputesByUser()).as('getDisputes');
      cy.route(IssuesRoute.findIssuesByDispute()).as('getIssues');
      cy.route(PeopleRoute.findPeopleByDispute()).as('getPeople');
      cy.route(DocumentsRoute.listDocumentFiles()).as('getDocuments');
      cy.route(DocumentsRoute.findDocumentMetadataByDispute()).as('getDocumentMetadata');
      cy.route(PleadingsRoute.findParagraphsByDispute()).as('getPleadings');
      cy.route(EventsRoute.findChronologyEventsByDispute()).as('getEvents');
      cy.route(EvidencesRoute.findEvidencesByDisputeAndReturnEmpty()).as('getEmptyEvidences');
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
