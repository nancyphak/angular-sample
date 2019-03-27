import {
  DisputeRoute,
  EvidencesRoute,
  IssuesRoute,
  PeopleRoute,
  DocumentsRoute,
  PleadingsRoute,
  EventsRoute
} from '../../mockapi/routes';

describe('People page', function () {
  const disputeFixture = DisputeRoute.findDisputesByUser().response;
  const peopleFixture = PeopleRoute.findPeopleByDispute().response;
  const firstDispute = disputeFixture[0];
  const pageUrl = `disputes/${firstDispute.id}/people/issues`;

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

    it('Should be able show the list people', function () {
      cy.url().should('include', pageUrl);

      const displayedItems = cy.get('[data-cy="namePerson"]');
      displayedItems.should('have.length', peopleFixture.length);

      cy.window().then((window: any) => {
        const event = new Event('commitState');
        window.dispatchEvent(event);
      });
    });

    it('Should be able to create a person', function () {
      cy.route(PeopleRoute.createPerson()).as('postCreatePerson');

      const personName = 'Marcus Rashford';

      cy.get('[data-cy="createPerson"]').first().click();
      cy.get('[data-cy="inputTitle"]').type(personName);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postCreatePerson').then(($res: any) => {
        const person = $res.requestBody;
        expect(person.name).to.eq(personName);
      });
      cy.get('[data-cy="namePerson"]').should(($p) => {
        expect($p.first()).to.contain(personName);
      });
    });

    it('Should be able to rename a person', function () {
      cy.route(PeopleRoute.renamePerson()).as('postRenamePerson');

      const personToRename = peopleFixture[0];
      const newName = 'Marcus Rashford 2';

      cy.get('[data-cy="menuPerson"]').first().click();
      cy.get('[data-cy="renamePerson"]').click();
      cy.get('[data-cy="inputTitle"]').clear().type(newName);
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRenamePerson').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: personToRename.disputeId,
          newName: newName,
          personId: personToRename.id,
        });
      });
      cy.get('[data-cy="namePerson"]').should(($p) => {
        expect($p.first()).to.contain(newName);
      });
    });

    it('Should be able to remove a person', function () {
      cy.route(PeopleRoute.deletePerson()).as('postRemovePerson');

      const personToDelete = peopleFixture[0];

      cy.get('[data-cy="menuPerson"]').first().click();
      cy.get('[data-cy="removePerson"]').click();
      cy.get('[data-cy="submit"]').click();

      cy.wait('@postRemovePerson').then($res => {
        expect($res.requestBody).to.deep.eq({
          disputeId: personToDelete.disputeId,
          personId: personToDelete.id,
        });
      });
      cy.get('[data-cy="namePerson"]').should('not.have.value', personToDelete.name);
    });
  });

  context('Empty Data', () => {
    beforeEach(function () {
      cy.server();
      cy.route(DisputeRoute.findDisputesByUser()).as('getDisputes');
      cy.route(IssuesRoute.findIssuesByDispute()).as('getIssues');
      cy.route(EvidencesRoute.findEvidenceByDispute()).as('getEvidences');
      cy.route(PeopleRoute.findPeopleByDisputeAndReturnEmpty()).as('getEmptyPeople');
      cy.route(DocumentsRoute.listDocumentFiles()).as('getDocuments');
      cy.route(DocumentsRoute.findDocumentMetadataByDispute()).as('getDocumentMetadata');
      cy.route(PleadingsRoute.findParagraphsByDispute()).as('getPleadings');
      cy.route(EventsRoute.findChronologyEventsByDispute()).as('getEvents');
      cy.addAuthTokenAndVisit(pageUrl);
    });

    it('Should be able to show empty page when get empty response', function () {
      cy.wait('@getEmptyPeople').then((res: any) => {
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
