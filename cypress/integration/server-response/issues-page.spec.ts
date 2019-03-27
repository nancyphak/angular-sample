// describe('Login success and appear dispute page', function () {
//   beforeEach(function () {
//     cy.loginWithAuth0()
//       .wait(5000);
//     cy.visitHome();
//   });

//   it('should be able create/rename/remove Issue', function () {
//     cy.server();
//     cy.log('should be able to navigate to dispute');
//     cy.url().should('include', 'disputes');

//     cy.log('should be able have a new dispute').route('POST', 'api/cmd/CreateDispute').as('postCreateDispute');
//     cy.get('[data-cy="createDispute"]').click();
//     cy.get('[data-cy="inputTitle"]').type('test 01');
//     cy.get('[data-cy="submit"]').click();
//     cy.wait('@postCreateDispute').its('url').should('include', 'api/cmd/CreateDispute');
//     cy.get('[data-cy="nameDispute"]').should(($p) => {
//       expect($p.first()).to.contain('test 01');
//     });

//     cy.log('should be able to navigate to issue');
//     cy.get('[data-cy="nameDispute"]').first().click();
//     cy.url().should('include', '/issues');

//     cy.log('should be able have a new issue').route('POST', 'api/cmd/CreateIssue').as('postCreateIssue');
//     cy.get('[data-cy="createIssue"]').first().click();
//     cy.get('[data-cy="inputTitle"]').type('issue-01');
//     cy.get('[data-cy="submit"]').click();
//     cy.wait('@postCreateIssue').its('url').should('include', 'api/cmd/CreateIssue');
//     cy.get('[data-cy="nameIssue"]').should(($p) => {
//       expect($p.first()).to.contain('issue-01');
//     });

//     cy.log('should be able rename issue').route('POST', 'api/cmd/RenameIssue').as('postRenameIssue');
//     cy.get('[data-cy="input-text"]').first().click();
//     cy.get('[data-cy="input-text"]').first().clear().type('rename-issue-01');
//     cy.get('[data-cy="input-text"]').first().blur();
//     cy.wait('@postRenameIssue').its('url').should('include', 'api/cmd/RenameIssue');
//     cy.get('[data-cy="nameIssue"]').first().should(($p) => {
//       expect($p).to.contain('rename-issue-01');
//     });

//     cy.log('should be able remove issue').route('POST', 'api/cmd/DeleteIssue').as('postDeleteIssue');
//     cy.get('[data-cy="menuIssue"]').first().click();
//     cy.get('[data-cy="removeIssue"]').click();
//     cy.get('[data-cy="submit"]').click();

//     cy.wait('@postDeleteIssue').its('url').should('include', 'api/cmd/DeleteIssue');
//     cy.get('[data-cy="nameIssue"]').should('not.have.value', 'rename-issue-01');
//   })

// });
// describe('Drag and drop', function () {

//   beforeEach(function () {
//     cy.loginWithAuth0()
//       .wait(5000);
//     cy.visitHome();
//   });

//   it('should be able create 3 issues', function () {
//     cy.server();
//     cy.log('should be able to navigate to dispute');
//     cy.url().should('include', 'disputes');

//     cy.log('should be able to navigate to issue');
//     cy.get('[data-cy="nameDispute"]').first().click();
//     cy.url().should('include', 'issues');

//     cy.log('should be able have a new issue').route('POST', 'api/cmd/CreateIssue').as('postCreateIssue');
//     cy.get('[data-cy="createIssue"]').first().click();
//     cy.get('[data-cy="inputTitle"]').type('issue-01');
//     cy.get('[data-cy="submit"]').click();
//     cy.wait('@postCreateIssue').its('url').should('include', 'api/cmd/CreateIssue');
//     cy.get('[data-cy="nameIssue"]').should(($p) => {
//       expect($p.first()).to.contain('issue-01');
//     });

//     cy.get('[data-cy="createIssue"]').first().click();
//     cy.get('[data-cy="inputTitle"]').type('issue-02');
//     cy.get('[data-cy="submit"]').click();
//     cy.wait('@postCreateIssue').its('url').should('include', 'api/cmd/CreateIssue');
//     cy.get('[data-cy="nameIssue"]').should(($p) => {
//       expect($p.first()).to.contain('issue-02');
//     });

//     cy.get('[data-cy="createIssue"]').first().click();
//     cy.get('[data-cy="inputTitle"]').type('issue-03');
//     cy.get('[data-cy="submit"]').click();
//     cy.wait('@postCreateIssue').its('url').should('include', 'api/cmd/CreateIssue');
//     cy.get('[data-cy="nameIssue"]').should(($p) => {
//       expect($p.first()).to.contain('issue-03');
//     });

//     cy.log('should drag issue-03 under issue-01').route('POST', 'api/cmd/SetIssuePosition').as('postSetIssuePosition');
//     cy.get('[data-cy="draggable"]').first().trigger('dragstart', {
//       dataTransfer: {
//         setData: () => {
//           'text', ''
//         }
//       }
//     });
//     cy.get('[data-cy="drop"]').trigger('drop', {force: true});
//     cy.wait('@postSetIssuePosition').its('url').should('include', 'api/cmd/SetIssuePosition');
//     cy.get('[data-cy="nameIssue"]').should(($p) => {
//       expect($p.first()).to.contain('issue-02');
//     });
//   })
// });
