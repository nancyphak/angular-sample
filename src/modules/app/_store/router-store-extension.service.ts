import { Injectable } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from './reducers';

@Injectable()
export class RouterStoreExtension {
  protected lastRoutesRecognized: RoutesRecognized = null;

  constructor(
    router: Router,
    stateSerializer: RouterStateSerializer<any>,
    store: Store<fromRoot.AppState>,
  ) {
    router.events.pipe(
      filter<RoutesRecognized>((event) => event instanceof RoutesRecognized),
    ).subscribe(e => {
      this.lastRoutesRecognized = e;
    });

    router.events.pipe(
      filter<NavigationEnd>((event) => event instanceof NavigationEnd),
      withLatestFrom(store.select(fromRoot.getRouterState)),
      // when timetraveling the event.id is an old one, but the navigation triggered uses a new id
      // this prevents the dispatch of ROUTE_ACTIVE when the state was changed by dev tools
      filter(([event, routerReducer]) => {
        return routerReducer.navigationId === event.id;
      })
    )
      .subscribe(() => {
        const routerStateSer = stateSerializer.serialize(router.routerState.snapshot);
        store.dispatch({
          type: 'ROUTER_ACTIVE',
          payload: {
            routerState: routerStateSer,
            event: new RoutesRecognized(
              this.lastRoutesRecognized.id,
              this.lastRoutesRecognized.url,
              this.lastRoutesRecognized.urlAfterRedirects,
              routerStateSer as any
            )
          }
        });

      });
  }
}
