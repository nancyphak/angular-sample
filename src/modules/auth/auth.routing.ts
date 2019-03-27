import { Routes } from '@angular/router';

import { appConfig } from '@app/config';
import { LoginCallbackComponent } from './containers';

export const authRouting: Routes = [
  {
    path: appConfig.routing.auth.loginCallback,
    component: LoginCallbackComponent
  }
];

