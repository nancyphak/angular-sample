// describe('access secret admin functionality', function () {
//   beforeEach(function () {
//     cy.loginWithAuth0()
//       .wait(5000);
//     cy.visitHome();
//   });

//   it('should be able create/rename/remove Dispute', function () {
//     cy.server();
//     cy.log('should be able to navigate to dispute');
//     cy.url().should('include', 'disputes');

//     cy.log('should be able have a new dispute').route('POST', 'api/cmd/CreateDispute').as('postCreateDispute');
//     cy.get('[data-cy="createDispute"]').first().click();
//     cy.get('[data-cy="inputTitle"]').type('test 01');
//     cy.get('[data-cy="submit"]').click();
//     cy.wait('@postCreateDispute').its('url').should('include', 'api/cmd/CreateDispute');
//     cy.get('[data-cy="nameDispute"]').should(($p) => {
//       expect($p.first()).to.contain('test 01');
//     });

//     cy.log('should be able rename dispute');
//     cy.route('POST', 'api/cmd/RenameDispute').as('postRenameDispute');

//     cy.get('[data-cy="menuDispute"]').first().click();
//     cy.get('[data-cy="renameDispute"]').click();
//     cy.get('[data-cy="inputTitle"]').clear().type('rename test-01');
//     cy.get('[data-cy="submit"]').click();

//     cy.wait('@postRenameDispute').its('url').should('include', 'api/cmd/RenameDispute');
//     cy.get('[data-cy="nameDispute"]').should(($p) => {
//       expect($p.first()).to.contain('rename test-01');
//     });

//     cy.log('should be able remove dispute');
//     cy.route('POST', 'api/cmd/DeleteDispute').as('postDeleteDispute');

//     cy.get('[data-cy="menuDispute"]').first().click();
//     cy.get('[data-cy="removeDispute"]').click();
//     cy.get('[data-cy="submit"]').click();

//     cy.wait('@postDeleteDispute').its('url').should('include', 'api/cmd/DeleteDispute');
//     cy.get('[data-cy="nameDispute"]').should('not.have.value', 'rename test-01');
//   })
// });
