import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { v4 as uuid } from 'uuid';
import { Observable, Subscription } from 'rxjs';

import { Error } from 'modules/app/_store';
import { NetworkService, PromptDialog, AutoTrackViewComponent } from 'modules/shared';
import { AuthService } from 'modules/auth/services';
import * as fromStore from '../../_store';
import { Chronology, Dispute, DocumentMetadata, DocumentModel, RightSideMenu } from '../../models';
import { withLatestFrom } from 'rxjs/operators';
import { selectActivatedRoute } from '../../../app/_store';
import { RouterService } from '../../../app/services';


@Component({
  selector: 'chronology-page',
  templateUrl: './chronology-page.component.html',
  styleUrls: ['./chronology-page.component.scss']
})
export class ChronologyPageComponent extends AutoTrackViewComponent implements OnInit {
  selectedDocument$: Observable<DocumentModel>;
  dispute$: Observable<Dispute>;
  chronologies$: Observable<Array<Chronology>>;
  events$: Observable<Array<any>>;
  error$: Observable<Error>;
  loading$: Observable<boolean>;
  activatedRoute$: Observable<any>;

  rightSideMenu: Array<RightSideMenu> = [
    {
      link: 'issues',
      name: 'Issues'
    },
    {
      link: 'people',
      name: 'People'
    },
    {
      link: 'pleadings',
      name: 'Pleadings'
    },
    {
      link: 'docs',
      name: 'Docs'
    },
    {
      link: 'facts',
      name: 'Facts'
    }
  ];

  activeMenu = this.rightSideMenu[0];

  private errorSubscription: Subscription;

  constructor(public auth: AuthService,
              private store: Store<fromStore.DisputeState>,
              public route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private router: Router,
              private networkService: NetworkService,
              private routerService: RouterService) {
    super(route);
    this.selectedDocument$ = this.store.pipe(select(fromStore.selectCurrentDocument));
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
    this.chronologies$ = this.store.pipe(select(fromStore.selectChronologyByDisputeId));
    this.events$ = this.store.pipe(select(fromStore.selectEventsByDisputeId));
    this.loading$ = this.store.pipe(select(fromStore.selectChronologiesLoading));
    this.error$ = this.store.pipe(select(fromStore.selectChronologyError));
    this.activatedRoute$ = this.store.pipe(select(selectActivatedRoute));

    this.getActiveMenu();
  }

  getActiveMenu() {
    this.routerService.rightPanelPath$.subscribe((path) => {
      if (path) {
        const name = path.split('/')[0];
        this.activeMenu = {
          name: name,
          link: path
        };
      }
    });
  }

  ngOnInit() {
    this.errorSubscription = this.error$.subscribe((error) => {
      if (error) {
        const message = !this.networkService.isOnline.value ? `Couldn't refresh data while offline` : error.message;
        const snackBarRef = this.snackBar.open(message, 'Retry', {duration: 10000});
        if (error.failedAction) {
          snackBarRef.onAction().subscribe(() => {
            this.store.dispatch(error.failedAction);
          });
        }
      }
    });
  }

  onCreateBtnClick() {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Create Event',
        placeholder: 'Description',
        placeholderDate: 'Choose a day',
        okButtonText: 'Create'
      }
    });
    dialogRef.afterClosed().pipe(
      withLatestFrom(this.activatedRoute$)
    ).subscribe(([result, route]) => {
      if (result) {
        const event: Chronology = {
          id: uuid(),
          disputeId: route.params.disputeId,
          description: result.text,
          date: result.date.toISOString()
        };
        this.store.dispatch(new fromStore.CreateChronology(event));
      }

    });
  }

  onUpdateChronologyEvent(event): void {
    this.store.dispatch(new fromStore.UpdateChronology(event));
  }

  onRemoveChronologyEvent(event): void {
    this.store.dispatch(new fromStore.RemoveChronology(event));
  }

  onSelectMenu(item: RightSideMenu) {
    this.activeMenu = item;
    this.router.navigate([item.link], {
      relativeTo: this.route
    });
  }

}
