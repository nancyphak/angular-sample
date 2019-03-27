import {
  DisputeRoute,
  EvidencesRoute,
  IssuesRoute,
  PeopleRoute,
  DocumentsRoute,
  PleadingsRoute,
  EventsRoute
} from '../../mockapi/routes';

describe('Pleadings page', function () {
  const disputeFixture = DisputeRoute.findDisputesByUser().response;
  const pleadingsFixture = PleadingsRoute.findParagraphsByDispute().response;
  const firstDispute = disputeFixture[0];
  const pageUrl = `disputes/${firstDispute.id}/pleadings/issues`;

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

    it('Should be able show the list pleadings', function () {
      cy.url().should('include', pageUrl);

      const displayedItems = cy.get('[data-cy="titleParagraph"]');
      displayedItems.should('have.length', pleadingsFixture.length);

      cy.window().then((window: any) => {
        const event = new Event('commitState');
        window.dispatchEvent(event);
      });
    });

    it('Should be able open and close dialog edit pleadings', function () {
      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(1000);
      cy.get('[data-cy="closeEditPleadings"]').click();
      cy.wait(1000);
      cy.get('[data-cy="editPleadings"]').should(($p) => {
        expect($p).to.contain('Edit Pleadings');
      });
    });

    it('Should be able to create a paragraph and add sentences', function () {
      cy.server();
      cy.route(PleadingsRoute.createParagraph()).as('postCreateParagraph');

      const paragraphTitle = 'paragraph 3';

      cy.get('[data-cy="editPleadings"]').click();
      cy.get('[data-cy="createParagraph"]').first().click();
      cy.get('[data-cy="inputTitle"]').type(paragraphTitle);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postCreateParagraph').then(($res: any) => {
        const paragraph = $res.requestBody;
        expect(paragraph['title']).to.eq(paragraphTitle);
      });
      cy.get('[data-cy="titleParagraph"]').should(($p) => {
        expect($p.last()).to.contain(paragraphTitle);
      });

      cy.route(PleadingsRoute.addParagraphSentences()).as('postAddParagraphSentences');

      const sentenceText = 'sentences test';

      cy.get('[data-cy="addParagraphSentence"]').last().click();
      cy.get('[data-cy="textareaSentences"]').type(sentenceText);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postAddParagraphSentences').its('url').should('include', 'api/cmd/AddParagraphSentences');
      cy.get('[data-cy="textSentences"]').should(($p) => {
        expect($p.last()).to.contain(sentenceText);
      });
      cy.get('[data-cy="closeEditPleadings"]').click();
    });

    it('Should be able to create a response and add sentences', function () {
      cy.route(PleadingsRoute.createResponse()).as('postCreateResponse');

      const responseTitle = 'response 2';

      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(500);

      cy.get('[data-cy="createResponse"]').first().click();
      cy.get('[data-cy="inputTitle"]').type(responseTitle);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postCreateResponse').then(($res: any) => {
        const response = $res.requestBody;
        expect(response['title']).to.eq(responseTitle);
      });
      cy.get('[data-cy="titleResponse"]').should(($p) => {
        expect($p.last()).to.contain(responseTitle);
      });

      cy.route(PleadingsRoute.addResponseSentences()).as('postAddResponseSentences');
      const responseSplitSentence = {'sentences': ['sentences test-1.', 'sentences test-2']};
      const sentenceText = 'sentences test-1. sentences test-2';
      const sentenceTextLast = 'sentences test-2';
      cy.route(PleadingsRoute.splitSentence(responseSplitSentence)).as('postSplitSentence');

      cy.get('[data-cy="addResponseSentence"]').last().click();
      cy.get('[data-cy="textareaSentences"]').type(sentenceText);
      cy.get('[data-cy="splitSentences"]').click();

      cy.wait('@postSplitSentence').its('url').should('include', 'api/svc/SplitSentence');
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postAddResponseSentences').its('url').should('include', 'api/cmd/AddResponseSentences');
      cy.get('[data-cy="textSentences"]').should(($p) => {
        expect($p.last()).to.contain(sentenceTextLast);
      });
      cy.get('[data-cy="closeEditPleadings"]').click();
    });

    it('should be able to rename a paragraph', function () {
      cy.route(PleadingsRoute.renameParagraph()).as('postRenameParagraph');

      const newName = 'rename paragraph 1';
      const paragraphToRename = pleadingsFixture[0];

      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(500);

      cy.get('[data-cy="renameParagraph"]').first().click();
      cy.get('[data-cy="inputTitle"]').clear().type(newName);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRenameParagraph').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: paragraphToRename.disputeId,
          id: paragraphToRename.id,
          newTitle: newName
        });
      });
      cy.get('[data-cy="titleParagraph"]').should(($p) => {
        expect($p.first()).to.contain(newName);
      });
      cy.get('[data-cy="closeEditPleadings"]').click();
    });

    it('should be able to rename a response', function () {
      cy.route(PleadingsRoute.renameResponse()).as('postRenameResponse');

      const newName = 'rename response 1';
      const responseToRename = pleadingsFixture[0]['responses'][0];

      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(500);

      cy.get('[data-cy="renameResponse"]').first().click();
      cy.get('[data-cy="inputTitle"]').clear().type(newName);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRenameResponse').then($res => {
        expect($res.requestBody).to.deep.eq({
          id: responseToRename.id,
          disputeId: responseToRename.disputeId,
          newTitle: newName,
          paragraphId: responseToRename.paragraphId,
        });
      });
      cy.get('[data-cy="titleResponse"]').should(($p) => {
        expect($p.first()).to.contain(newName);
      });
      cy.get('[data-cy="closeEditPleadings"]').click();
    });

    it('should be able to remove a paragraph', function () {
      cy.route(PleadingsRoute.deleteParagraph()).as('postRemoveParagraph');

      const ParagraphToDelete = pleadingsFixture[0];

      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(500);

      cy.get('[data-cy="removeParagraph"]').first().click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRemoveParagraph').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: ParagraphToDelete.disputeId,
          id: ParagraphToDelete.id,
        });
      });
      cy.get('[data-cy="titleParagraph"]').should('not.have.value', ParagraphToDelete.title);
      cy.get('[data-cy="closeEditPleadings"]').click();
    });
    it('should be able to remove a response', function () {
      cy.route(PleadingsRoute.deleteResponse()).as('postRemoveResponse');

      const responseToDelete = pleadingsFixture[0]['responses'][0];

      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(500);

      cy.get('[data-cy="removeResponse"]').first().click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRemoveResponse').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: responseToDelete.disputeId,
          id: responseToDelete.id,
          paragraphId: responseToDelete.paragraphId,
        });
      });
      cy.get('[data-cy="titleResponse"]').should('not.have.value', responseToDelete.title);
      cy.get('[data-cy="closeEditPleadings"]').click();
    });

    it('should be able to remove a sentence paragraph', function () {
      cy.route(PleadingsRoute.deleteSentence()).as('postRemoveSentence');

      const sentenceToDelete = pleadingsFixture[0]['sentences'][0];
      const ParagraphOfSentenceToDelete = pleadingsFixture[0];

      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(500);

      cy.get('[data-cy="removeSentence"]').first().click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRemoveSentence').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: ParagraphOfSentenceToDelete.disputeId,
          id: sentenceToDelete.id,
        });
      });
      cy.get('[data-cy="textSentences"]').should('not.have.value', sentenceToDelete.text);
      cy.get('[data-cy="closeEditPleadings"]').click();
    });
    it('should be able to remove a sentence response', function () {
      cy.route(PleadingsRoute.deleteSentence()).as('postRemoveSentence');

      const sentenceToDelete = pleadingsFixture[0]['responses'][0]['sentences'][0];
      const responseOfSentenceToDelete = pleadingsFixture[0]['responses'][0];

      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(500);

      cy.get('[data-cy="removeSentence"]').last().click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRemoveSentence').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: responseOfSentenceToDelete.disputeId,
          id: sentenceToDelete.id
        });
      });
      cy.get('[data-cy="textSentences"]').should('not.have.value', sentenceToDelete.text);
      cy.get('[data-cy="closeEditPleadings"]').click();
    });

    it('should be able to edit a sentence paragraph', function () {
      cy.route(PleadingsRoute.updateSentenceText()).as('postUpdateSentenceText');

      const sentenceToUpdate = pleadingsFixture[0]['sentences'][0];
      const ParagraphOfSentenceToUpdate = pleadingsFixture[0];
      const newSentence = 'edit sentences test';

      cy.get('[data-cy="editPleadings"]').click();
      cy.wait(500);

      cy.get('[data-cy="editSentence"]').first().click();
      cy.get('[data-cy="textareaEditSentence"]').clear().type(newSentence);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postUpdateSentenceText').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: ParagraphOfSentenceToUpdate.disputeId,
          id: sentenceToUpdate.id,
          newText: newSentence
        });
      });
      cy.get('[data-cy="textSentences"]').should(($p) => {
        expect($p.first()).to.contain(newSentence);
      });
      cy.get('[data-cy="closeEditPleadings"]').click();
    });
  });

  context('Empty Data', () => {
    beforeEach(function () {
      cy.server();
      cy.route(DisputeRoute.findDisputesByUser()).as('getDisputes');
      cy.route(IssuesRoute.findIssuesByDispute()).as('getIssues');
      cy.route(EvidencesRoute.findEvidenceByDispute()).as('getEvidences');
      cy.route(PeopleRoute.findPeopleByDispute()).as('getPeople');
      cy.route(DocumentsRoute.listDocumentFiles()).as('getDocuments');
      cy.route(DocumentsRoute.findDocumentMetadataByDispute()).as('getDocumentMetadata');
      cy.route(PleadingsRoute.findPleadingsByDisputeAndReturnEmpty()).as('getEmptyPleadings');
      cy.route(EventsRoute.findChronologyEventsByDispute()).as('getEvents');
      cy.addAuthTokenAndVisit(pageUrl);
    });

    it('Should be able to show empty page when get empty response', function () {
      cy.wait('@getEmptyPleadings').then((res: any) => {
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
