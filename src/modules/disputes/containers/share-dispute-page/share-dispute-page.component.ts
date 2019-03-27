import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { appConfig } from '@app/config';
import * as fromStore from '../../_store';
import { AutoTrackViewComponent, ConfirmDialog, PromptDialog } from '../../../shared';
import { CreateShareDisputeModel, Dispute, ShareDisputeModel } from '../../models';
import { selectActivatedRoute } from '../../../app/_store';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'share-dispute-page',
  templateUrl: './share-dispute-page.component.html',
  styleUrls: ['./share-dispute-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ShareDisputePageComponent extends AutoTrackViewComponent implements OnInit, OnDestroy {

  dispute$: Observable<Dispute>;
  shares$: Observable<Array<any>>;
  loading$: Observable<boolean>;
  isExistsShare$: Observable<boolean>;
  activatedRoute$: Observable<any>;

  private componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private store: Store<fromStore.DisputeState>,
              route: ActivatedRoute,
              public dialog: MatDialog) {
    super(route);
  }

  ngOnInit() {
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
    this.shares$ = this.store.pipe(select(fromStore.selectSharesByDisputeId));
    this.loading$ = this.store.pipe(select(fromStore.selectSharesLoading));
    this.isExistsShare$ = this.store.pipe(select(fromStore.checkISharesExistedForSelectedDispute));
    this.activatedRoute$ = this.store.pipe(select(selectActivatedRoute));

    this.activatedRoute$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((route) => {
      this.store.dispatch(new fromStore.LoadShares(route.params.disputeId));
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onInviteUser() {
    const dialogRef = this.dialog.open(PromptDialog, {
        width: '350px',
        disableClose: true,
        data: {
          title: 'Invite User',
          placeholder: 'Email Name',
          okButtonText: 'Add',
          required: true,
          novalidate: false,
          pattern: appConfig.patternEmail,
          errorMess: 'Not a valid email'
        }
      })
    ;

    dialogRef.afterClosed().pipe(
      withLatestFrom(this.activatedRoute$)
    ).subscribe(([result, route]) => {
      if (result.text) {
        const share: CreateShareDisputeModel = {
          id: uuid(),
          email: result.text,
          disputeId: route.params.disputeId,
          status: 'PENDING'
        };
        this.store.dispatch(new fromStore.CreateShare(share));
      }
    });
  }

  onRemoveShare(share: ShareDisputeModel) {
    this.dialog.open(ConfirmDialog,
      {
        data: {
          title: 'Delete ' + share.email + '?',
          message: 'Are you sure that you want to stop sharing the case with this person?'
        }
      }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          const payload = {id: share.id, disputeId: share.disputeId};
          this.store.dispatch(new fromStore.RemoveShare(payload));
        }
      });
  }
}
