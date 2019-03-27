import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, ApplicationRef, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment as env } from '@app/env';
import { AuthModule } from 'modules/auth';
import { SharedModule } from 'modules/shared';
import * as fromGuard from './_guards';
import * as fromStore from './_store';
import { appRouting } from './app.routing';
import { AuthInterceptor, RetryInterceptor } from './interceptors';
import { services, AppInsightsErrorHandler } from './services';
import { AppStoreTestingService } from './services/app-store.service';
import { RouterStoreExtension } from './_store/router-store-extension.service';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRouting, {
      preloadingStrategy: PreloadAllModules
    }),
    HttpClientModule,

    StoreModule.forRoot(fromStore.reducers, { metaReducers: fromStore.metaReducers }),
    EffectsModule.forRoot(fromStore.effects),
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument(),
    !env.production ? StoreDevtoolsModule.instrument() : [],
    OverlayModule,
    PortalModule,
    CommonModule,

    SharedModule,
    AuthModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true },
    {
      provide: RouterStateSerializer,
      useClass: fromStore.CustomRouterStateSerializer
    },
    {
      provide: ErrorHandler,
      useClass: AppInsightsErrorHandler
    },
    ...services,
    ...fromGuard.guards,
    AppStoreTestingService,
    RouterStoreExtension
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private routerStoreExtension: RouterStoreExtension,
    private appStoreService: AppStoreTestingService
  ) {
  }
}
