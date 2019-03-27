import { Routes } from '@angular/router';
import * as fromGuards from './_guards';
import * as containers from './containers';

export const disputesRouting: Routes = [
  {
    path: '',
    component: containers.DisputesPageComponent
  },
  {
    path: ':disputeId',
    component: containers.DisputeDetailPageComponent,
    canActivate: [
      fromGuards.DisputeExistsGuards,
      fromGuards.PeopleExistsGuard,
      fromGuards.EvidenceExistsGuard,
      fromGuards.IssueExistsGuard,
      fromGuards.PleadingsExistsGuard,
      fromGuards.ChronologiesExistsGuard,
      fromGuards.DocumentMetadataGuard,
      fromGuards.DocumentsLoadedGuard
    ],
    children: [
      {
        path: 'issues',
        component: containers.IssuesPageComponent,
        canDeactivate: [fromGuards.UnSavedGuard]
      },
      {
        path: 'issues/:issueId',
        component: containers.IssuesPageComponent,
        canDeactivate: [fromGuards.UnSavedGuard]
      },
      {
        path: 'documents',
        canDeactivate: [fromGuards.UnSavedGuard],
        component: containers.DocumentsPageComponent
      },
      {
        path: 'documents/:documentId/view',
        component: containers.DocumentViewPageComponent
      },
      {
        path: 'people',
        component: containers.PeoplePageComponent
      },
      {
        path: 'pleadings',
        component: containers.PleadingsPageComponent
      },
      {
        path: 'events',
        component: containers.ChronologyPageComponent
      },
      {
        path: 'facts',
        component: containers.EvidencesPageComponent
      },
      {
        path: 'sharing',
        canDeactivate: [fromGuards.UnSavedGuard],
        component: containers.ShareDisputePageComponent
      }
    ]
  }
];
