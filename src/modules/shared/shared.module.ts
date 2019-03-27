import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { materialModules } from './material-module';
import { FlexLayoutModule } from '@angular/flex-layout';

import * as fromComponent from './components';
import * as fromDirectives from './directives';
import * as fromServices from './services';
import { customValidatorsDirectives } from './validations';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ...materialModules
  ],
  declarations: [
    ...fromComponent.components,
    ...fromDirectives.directives,
    ...customValidatorsDirectives
  ],
  entryComponents: [
    ...fromComponent.entryComponents
  ],
  providers: [
    ...fromServices.services
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    ...materialModules,
    ...fromComponent.components,
    ...fromDirectives.directives,
    ...customValidatorsDirectives
  ]
})
export class SharedModule {
}
