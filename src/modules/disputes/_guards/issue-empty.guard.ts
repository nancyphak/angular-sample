import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take, tap, map, switchMap } from 'rxjs/operators';
import * as fromStore from '../_store';
import { NetworkService } from 'modules/shared';
import { RouterService } from 'modules/app/services';

@Injectable()
export class IssueEmptyGuard implements CanActivate {
  constructor(private networkService: NetworkService,
    private router: Router,
    private routerService: RouterService,
    private store: Store<fromStore.DisputeState>) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    if (!this.networkService.isOnline.value) {
      return true;
    }
    const disputeId = this.routerService.params['disputeId'];
    return this.waitForIssuesToLoad(disputeId).pipe(
      switchMap(() => {
        return this.isEmptyIssueInStore(disputeId);
      })
    );
  }

  isEmptyIssueInStore(disputeId: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.selectIssuesByDisputeId),
      tap((issues: Array<any>) => {
        if (issues && issues.length > 0) {
          this.router.navigate(['disputes', disputeId, 'issues', issues[0].id]);
        }
      }),
      map(issues => !issues || issues.length === 0),
      take(1)
    );
  }

  waitForIssuesToLoad(disputeId: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.selectDisputeIdOfIssuesEntries),
      map(disputeIdInStore => disputeIdInStore === disputeId),
      filter(loaded => loaded),
      take(1)
    );
  }
}
