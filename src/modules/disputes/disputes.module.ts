import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { MarkdownModule } from 'ngx-markdown';

import { SharedModule } from 'modules/shared';
import { undoReducer } from 'modules/app/_store';

import { disputesRouting } from './disputes.routing';
import * as fromGuards from './_guards';
import * as fromStore from './_store';
import * as fromComponent from './components';
import * as fromContainer from './containers';
import * as fromService from './services';
import { SentenceHighLightPipe } from './pipes/sentence-highlight.pipe';

export const DateFormat = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearLabel: 'MM/YYYY',
    monthYearA11yLabel: 'MM/YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(disputesRouting),
    StoreModule.forFeature(fromStore.accountFeatureName, fromStore.accountReducers, { metaReducers: [undoReducer] }),
    StoreModule.forFeature(fromStore.disputeFeatureName, fromStore.disputeReducers, { metaReducers: [undoReducer] }),
    EffectsModule.forFeature(fromStore.effects),
    NgxDnDModule,
    ScrollToModule.forRoot(),
    MarkdownModule.forRoot(),
    SharedModule,
    MatMomentDateModule
  ],
  declarations: [
    ...fromComponent.components,
    ...fromContainer.containers,
    SentenceHighLightPipe,
  ],
  entryComponents: [
    fromComponent.entryComponents
  ],
  providers: [
    ...fromService.services,
    ...fromGuards.guards,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat }
  ]
})
export class DisputesModule {
}
