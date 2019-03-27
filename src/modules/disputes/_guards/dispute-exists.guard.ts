import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take, tap, withLatestFrom } from 'rxjs/operators';
import * as fromStore from '../_store';
import { NetworkService } from 'modules/shared';
import { RouterService } from 'modules/app/services';
import { selectRouterState } from '../../app/_store/reducers';

@Injectable()
export class DisputeExistsGuards implements CanActivate {
  constructor(private networkService: NetworkService,
              private routerService: RouterService,
              private store: Store<fromStore.DisputeState>) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    this.store.pipe(
      select(selectRouterState),
      take(1)
    ).subscribe((router) => {
      this.store.dispatch(new fromStore.SelectDispute(router.params.disputeId));
    });

    if (!this.networkService.isOnline.value) {
      return true;
    }
    return this.hasDisputeInStore();
  }

  hasDisputeInStore(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.selectDisputeEntities),
      withLatestFrom(this.store.pipe(select(selectRouterState))),
      map(([entities, router]) => !!entities[router.params.disputeId]),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadDisputes());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }

}
