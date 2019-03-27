import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'modules/shared';
import { CONTAINER_COMPONENTS, ProfilePageComponent } from './containers';

const routes = [
  {
    path: 'change-display-name',
    component: ProfilePageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ...CONTAINER_COMPONENTS
  ]
})
export class AccountModule {
}
