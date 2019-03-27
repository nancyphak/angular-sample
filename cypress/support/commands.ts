import { DisputeRoute, DocumentsRoute, EventsRoute, EvidencesRoute, IssuesRoute, PeopleRoute, PleadingsRoute } from '../mockapi/routes';

declare global {
  namespace Cypress {
    interface Chainable {
      addAuthTokenAndVisit: typeof addAuthTokenAndVisit;
      definedRoute: typeof definedRoute;
    }

  }
}

export function addAuthTokenAndVisit(pageUrl: string) {
  cy.visit(pageUrl, {
    onBeforeLoad: function (win: any) {
      const expiresIn = 7200;
      const expiresAt = expiresIn * 1000 + new Date().getTime();
      const token = {
        accessToken: 'fake access token',
        idToken: 'fake idToken',
        tokenType: 'Bearer',
        expiresIn: expiresIn,
        exp: expiresAt - (60 * 1000),
        expiresAt: expiresAt
      };
      win.localStorage.setItem('AUTHENTICATION_TOKEN', JSON.stringify(token));
    }

  });
}

export function definedRoute() {
  cy.server();
  cy.route(DisputeRoute.findDisputesByUser()).as('getDisputes');
  cy.route(IssuesRoute.findIssuesByDispute()).as('getIssues');
  cy.route(EvidencesRoute.findEvidenceByDispute()).as('getEvidences');
  cy.route(PeopleRoute.findPeopleByDispute()).as('getPeople');
  cy.route(DocumentsRoute.listDocumentFiles()).as('getDocuments');
  cy.route(DocumentsRoute.findDocumentMetadataByDispute()).as('getDocumentMetadata');
  cy.route(PleadingsRoute.findParagraphsByDispute()).as('getPleadings');
  cy.route(EventsRoute.findChronologyEventsByDispute()).as('getEvents');
}

Cypress.Commands.add('addAuthTokenAndVisit', addAuthTokenAndVisit);
Cypress.Commands.add('definedRoute', definedRoute);
