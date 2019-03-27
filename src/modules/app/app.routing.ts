import { Routes } from '@angular/router';

import { appConfig } from '@app/config';
import { AuthGuard } from './_guards';

export const appRouting: Routes = [
  {
    path: appConfig.routing.default,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: appConfig.routing.disputes.root,
        pathMatch: 'full'
      },
      {
        path: appConfig.routing.disputes.root,
        loadChildren: 'modules/disputes/disputes.module#DisputesModule'
      },
      {
        path: 'account',
        loadChildren: 'modules/account/account.module#AccountModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
