import { DisputeRoute } from '../../mockapi/routes/disputes';

describe('Disputes page', () => {
  const disputePageUrl = 'disputes';

  context('Valid Data', () => {

    const disputeFixture = DisputeRoute.findDisputesByUser().response;
    before(() => {
      cy.addAuthTokenAndVisit(disputePageUrl);
      cy.server();

      cy.route(DisputeRoute.findDisputesByUser()).as('getDisputes');
      cy.wait('@getDisputes').then((res: any) => {
        if (res) {
          cy.window().then((window) => {
            const event = new Event('commitState');
            window.dispatchEvent(event);
          });
        }
      });
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

    it('Should be able access to dispute page', () => {
      cy.url().should('include', disputePageUrl);

      const displayedItems = cy.get('[data-cy="nameDispute"]');
      displayedItems.should('have.length', disputeFixture.length);
    });

    it('Should be able to create a dispute', () => {
      cy.route(DisputeRoute.createDispute()).as('postCreateDispute');

      const disputeName = 'new case';
      cy.get('[data-cy="createDispute"]').should('be.visible').first().click();
      cy.get('[data-cy="inputTitle"]').should('be.visible').type(disputeName);
      cy.get('[data-cy="submit"]').should('be.visible').click();

      cy.wait('@postCreateDispute').then(($res: any) => {
        const dispute = $res.requestBody;
        expect(dispute.name).to.eq(disputeName);
      });
      cy.get('[data-cy="nameDispute"]').should(($p) => {
        expect($p.first()).to.contain(disputeName);
      });
    });

    it('Should be able to rename a dispute (The first item of the list)', () => {

      cy.route(DisputeRoute.renameDispute()).as('postRenameDispute');

      const newName = 'rename case 1';
      const disputeToRename = disputeFixture[0];

      cy.get('[data-cy="menuDispute"]').should('be.visible').first().click();
      cy.get('[data-cy="renameDispute"]').should('be.visible').click();
      cy.get('[data-cy="inputTitle"]').should('be.visible').clear().type(newName);
      cy.get('[data-cy="submit"]').should('be.visible').click();

      cy.wait('@postRenameDispute').then(($res) => {
        expect($res.requestBody).to.deep.eq({
          disputeId: disputeToRename.id,
          newName: newName
        });
      });
      cy.get('[data-cy="nameDispute"]').should(($p) => {
        expect($p.first()).to.contain(newName);
      });
    });

    it('Should be able to remove a dispute (The first item of the list)', () => {
      cy.route(DisputeRoute.deleteDispute()).as('postDeleteDispute');

      const disputeToDelete = disputeFixture[0];

      cy.get('[data-cy="menuDispute"]').should('be.visible').first().click();
      cy.get('[data-cy="removeDispute"]').should('be.visible').click();
      cy.get('[data-cy="submit"]').should('be.visible').click();

      cy.wait('@postDeleteDispute').then(($res) => {
        expect($res.requestBody).to.deep.eq({
          DisputeId: disputeToDelete.id,
        });
      });
      cy.get('[data-cy="nameDispute"]').should('not.have.value', disputeToDelete.name);
    });
  });

  context('Empty Data', () => {
    beforeEach(() => {
      cy.server();
      cy.route(DisputeRoute.findDisputesByUserAndReturnEmpty()).as('getEmptyDisputes');
      cy.addAuthTokenAndVisit(disputePageUrl);
    });

    it('Should be able to show empty page when get empty response', () => {
      cy.wait('@getEmptyDisputes').then((res: any) => {
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
