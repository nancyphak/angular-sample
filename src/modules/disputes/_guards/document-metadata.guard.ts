import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take, tap, map } from 'rxjs/operators';

import * as fromStore from '../_store';
import { NetworkService } from '../../shared';

@Injectable()
export class DocumentMetadataGuard implements CanActivate {

  constructor(private networkService: NetworkService,
    private store: Store<fromStore.DisputeState>) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const disputeId = route.params.disputeId;
    if (!this.networkService.isOnline.value) {
      return true;
    }
    return this.hasDocumentViewInStore(disputeId);
  }

  hasDocumentViewInStore(disputeId: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.selectDisputeIdOfDocumentMetadataEntries),
      tap(disputeIdInStore => {
        if (disputeIdInStore !== disputeId) {
          this.store.dispatch(new fromStore.GetDocumentMetadataByDispute({ disputeId: disputeId }));
        }
      }),
      map(disputeIdInStore => {
        return disputeIdInStore === disputeId;
      }),
      filter(loaded => loaded),
      take(1)
    );
  }

}
