import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { authRouting } from './auth.routing';
import * as fromContainers from './containers';
import * as fromServices from './services';

@NgModule({
  imports: [
    RouterModule.forChild(authRouting)
  ],
  declarations: [
    ...fromContainers.containers
  ],
  providers: [
    ...fromServices.services
  ]
})
export class AuthModule {
}
