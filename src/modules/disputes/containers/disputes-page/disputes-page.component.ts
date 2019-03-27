import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Error } from 'modules/app/_store';
import { PromptDialog, LoadingDialog, AutoTrackViewComponent } from 'modules/shared';
import { NetworkService, NotifyDialog } from 'modules/shared';
import { AuthService } from 'modules/auth/services';
import * as fromStore from '../../_store';
import { Dispute } from '../../models';

@Component({
  selector: 'disputes-page',
  templateUrl: './disputes-page.component.html',
  styleUrls: ['./disputes-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DisputesPageComponent extends AutoTrackViewComponent implements OnDestroy {

  disputes$: Observable<Array<Dispute>>;
  loading$: Observable<boolean>;
  error$: Observable<Error>;
  disputesIsEmpty$: Observable<boolean>;

  private loadingDialogRef: MatDialogRef<LoadingDialog, any>;
  private subscriptions: Array<Subscription> = [];

  constructor(public auth: AuthService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    public route: ActivatedRoute,
    private networkService: NetworkService,
    private store: Store<fromStore.AccountState>) {

    super(route);

    this.loadData();
    this.selectDataFromStore();
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribeEvents();
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
    }
  }

  resetPassword() {
    this.auth.requestResetPassword()
      .then(() => {
        this.dialog.open(NotifyDialog, {
          width: '350px',
          data: {
            title: 'Reset Password',
            message: 'An email has been sent to you containing instructions on how to proceed. ' +
              'Your current password will not be changed unless you follow the link in the email.'
          }
        });
      })
      .catch((error) => {
        this.snackBar.open('Your account can not reset password', null, { duration: 3000 });
        throw error;
      });

  }

  private loadData() {
    this.store.dispatch(new fromStore.LoadDisputes());
  }

  private selectDataFromStore() {
    this.disputes$ = this.store.pipe(select(fromStore.selectAllDisputes));
    this.loading$ = this.store.pipe(select(fromStore.selectDisputesLoading));
    this.error$ = this.store.pipe(select(fromStore.selectDisputeError));
    this.disputesIsEmpty$ = this.store.pipe(select(fromStore.checkIfTheDisputesIsEmpty));
  }

  private subscribeEvents() {
    this.subscriptions.push(
      this.error$.subscribe((error) => {
        if (error) {
          const message = !this.networkService.isOnline.value ? `Couldn't refresh data while offline` : error.message;
          const snackBarRef = this.snackBar.open(message, 'Retry', { duration: 10000 });
          snackBarRef.onAction().subscribe(() => {
            this.store.dispatch(error.failedAction);
          });
        }
      })
    );
  }

  private unsubscribeEvents() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  onSelect(dispute: Dispute): void {
    this.loadingDialogRef = this.dialog.open(LoadingDialog, {
      panelClass: 'loading-spinner-panel',
      closeOnNavigation: true,
      disableClose: true
    });
    this.router.navigate(['disputes', dispute.id, 'issues']);
  }

  onUpdate(dispute: Dispute): void {
    this.store.dispatch(new fromStore.UpdateDispute(dispute));
  }

  onRemove(dispute: Dispute): void {
    this.store.dispatch(new fromStore.RemoveDispute(dispute));
  }

  onCreateBtnClick() {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Create Case',
        placeholder: 'Case Name',
        okButtonText: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.text) {
        const newDispute = {
          id: uuid(),
          name: result.text,
          timeCreated: new Date().toISOString()
        };
        this.store.dispatch(new fromStore.CreateDispute(newDispute));
      }
    });
  }

}
