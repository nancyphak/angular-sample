import {
  DisputeRoute,
  EvidencesRoute,
  IssuesRoute,
  PeopleRoute,
  DocumentsRoute,
  PleadingsRoute,
  EventsRoute
} from '../../mockapi/routes';

import { documentTypes } from '../../constants/document-type';

describe('Add token success and appear issues page have documents sidekick', () => {
  const issuesFixture = IssuesRoute.findIssuesByDispute().response;
  const listDocumentsFixture = DocumentsRoute.listDocumentFiles().response;
  const documentMetadataFixture = DocumentsRoute.findDocumentMetadataByDispute().response;
  const firstIssue = issuesFixture[0];
  const pageUrl = `disputes/${firstIssue.disputeId}/issues/${firstIssue.id}/docs`;
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

    it('Should be able show the list documents', () => {
      cy.url().should('include', pageUrl);

      const displayedItems = cy.get('[data-cy="description"]');
      displayedItems.should('have.length', listDocumentsFixture.length);

      cy.window().then((window: any) => {
        const event = new Event('commitState');
        window.dispatchEvent(event);
      });
    });

    it('Should be able show document detail document-01', () => {
      cy.url().should('include', pageUrl);

      const document = listDocumentsFixture[0];

      cy.get('[data-cy="description"]').first().click();
      cy.url().should('include', pageUrl + '/' + document.id);

      cy.get('[data-cy="input-description"]').should(($p) => {
        expect($p).to.have.value(document.description);
      });

      cy.get('[data-cy="back"]').first().click();
    });

    it('Should be able to rename document-01 ', () => {
      cy.url().should('include', pageUrl);
      cy.route(DocumentsRoute.renameDocument()).as('postRenameDocument');

      const documentToRename = listDocumentsFixture[0];
      const newName = 'rename-documents-01';

      cy.get('[data-cy="description"]').first().click();
      cy.get('[data-cy="input-description"]').first().click();
      cy.get('[data-cy="input-description"]').first().clear().type(newName);
      cy.get('[data-cy="input-description"]').first().blur();

      cy.wait('@postRenameDocument').then($res => {
        expect($res.requestBody).to.deep.eq({
          documentId: documentToRename.id,
          disputeId: documentToRename.disputeId,
          newName: newName + '.pdf'
        });
      });
      cy.get('[data-cy="input-description"]').should(($p) => {
        expect($p).to.have.value(newName);
      });

      cy.get('[data-cy="back"]').first().click();
    });

    it('Should be able to set type Other - Non-evidence', () => {
      cy.route(DocumentsRoute.setDocumentMetadata()).as('postSetDocumentMetadata');

      const documentToEdit = documentMetadataFixture[0];
      const typeId = documentTypes[0].id;

      cy.get('[data-cy="description"]').first().click();

      cy.get('[data-cy="documentTypes"]').click();
      cy.get('[data-cy="typeName"]').first().click();

      cy.wait('@postSetDocumentMetadata').then($res => {
        expect($res.requestBody).to.deep.eq({
          documentId: documentToEdit.documentId,
          disputeId: documentToEdit.disputeId,
          notes: documentToEdit.notes,
          typeId: typeId
        });
      });

      cy.get('[data-cy="back"]').first().click();
    });

    it('Should be able to set date', () => {
      cy.route(DocumentsRoute.setDocumentMetadata()).as('postSetDocumentMetadata');

      const documentToEdit = documentMetadataFixture[0];
      const date = '5/10/2011';
      const updateDate = '05 October 2011';

      cy.get('[data-cy="description"]').first().click();

      cy.get('[data-cy="date"]').click();
      cy.get('[data-cy="date"]').first().clear().type(date);
      cy.get('[data-cy="date"]').first().blur();

      cy.wait('@postSetDocumentMetadata').then($res => {
        expect($res.requestBody).to.deep.eq({
          documentId: documentToEdit.documentId,
          disputeId: documentToEdit.disputeId,
          notes: documentToEdit.notes,
          typeId: documentToEdit.typeId,
          date: new Date(updateDate).toISOString()
        });
      });

      cy.get('[data-cy="back"]').first().click();
    });

    it('Should be able to select people', () => {
      cy.route(DocumentsRoute.setDocumentPeople()).as('postSetDocumentPeople');

      const documentToSelectPeople = documentMetadataFixture[2];
      const peopleFixture = PeopleRoute.findPeopleByDispute().response;
      const person = peopleFixture[0];

      cy.get('[data-cy="description"]').last().click();
      cy.get('[data-cy="selectPeople"]').click();
      cy.get('[data-cy="selectPerson"]').first().click();
      cy.get('[data-cy="saveSelectPeople"]').click();

      cy.wait('@postSetDocumentPeople').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: documentToSelectPeople.disputeId,
          documentId: documentToSelectPeople.documentId,
          peopleIds: [person.id]
        });
      });

      cy.get('[data-cy="back"]').first().click();
    });

    it('Should be able to set notes', () => {
      cy.route(DocumentsRoute.setDocumentMetadata()).as('postSetDocumentMetadata');

      const newNotes = 'edit test notes 01';
      const documentToEdit = documentMetadataFixture[0];

      cy.get('[data-cy="description"]').first().click();
      cy.get('[data-cy="text-area"]').first().click();
      cy.get('[data-cy="text-area"]').first().clear().type(newNotes);
      cy.get('[data-cy="text-area"]').first().blur();

      cy.wait('@postSetDocumentMetadata').then($res => {
        expect($res.requestBody).to.deep.eq({
          documentId: documentToEdit.documentId,
          disputeId: documentToEdit.disputeId,
          notes: newNotes,
          typeId: documentToEdit.typeId,
        });
      });

      cy.get('[data-cy="back"]').first().click();
    });

    it('Should be able to navigate document view', () => {
      const document = listDocumentsFixture[0];
      const documentId = document.id;

      cy.get('[data-cy="description"]').first().click();
      cy.get('[data-cy="navigateDocsView"]').click();
      cy.url().should('include', documentId);
    });
  });

  context('Document split view', () => {
    const firstDocs = listDocumentsFixture[0];
    const lastDocs = listDocumentsFixture[2];
    const url = `disputes/${firstIssue.disputeId}/documents/${firstDocs.id}/view/docs/${lastDocs.id}`;
    before(() => {
      cy.definedRoute();
      cy.route(DocumentsRoute.downloadDocument()).as('downloadDocument');
      cy.addAuthTokenAndVisit(url);
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

    it('Should be able to show and close document split view', function () {
      cy.get('[data-cy="openSplitView"]').click();

      cy.url().should('include', 'split-view');

      const document = listDocumentsFixture[2];
      const description = document.description;

      cy.get('[data-cy="closeDocsSpliptView"]').click();

      cy.get('[data-cy="input-description"]').should(($p) => {
        expect($p).to.have.value(description);
      });

      cy.window().then((window: any) => {
        const event = new Event('commitState');
        window.dispatchEvent(event);
      });
    });

    it('Should be able to show document main view ', function () {
      const document = listDocumentsFixture[2];
      const documentId = document.id;

      cy.get('[data-cy="navigateDocsView"]').click();
      cy.url().should('include', documentId);
    });
  });

  context('Empty Data', () => {
    beforeEach(() => {
      cy.server();
      cy.route(DisputeRoute.findDisputesByUser()).as('getDisputes');
      cy.route(IssuesRoute.findIssuesByDispute()).as('getIssues');
      cy.route(EvidencesRoute.findEvidenceByDispute()).as('getEvidences');
      cy.route(PeopleRoute.findPeopleByDispute()).as('getPeople');
      cy.route(DocumentsRoute.listDocumentFilesAndReturnEmpty()).as('getEmptyDocuments');
      cy.route(DocumentsRoute.findDocumentMetadataByDispute()).as('getDocumentMetadata');
      cy.route(PleadingsRoute.findParagraphsByDispute()).as('getPleadings');
      cy.route(EventsRoute.findChronologyEventsByDispute()).as('getEvents');
      cy.addAuthTokenAndVisit(pageUrl);
    });
    it('Should be able to show empty page when get empty response', function () {

      cy.wait('@getEmptyDocuments').then((res: any) => {
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
