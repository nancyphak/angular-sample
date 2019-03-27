import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import * as _ from 'lodash';

import { AutoTrackViewComponent, NetworkService } from 'modules/shared';
import { Error, selectActivatedRoute } from 'modules/app/_store';
import * as fromStore from '../../_store';
import { Dispute, Pleading, RightSideMenu, AssignSentenceToIssueModel } from '../../models';
import { EditPleadingDialogComponent } from '../../components';
import { RouterService } from '../../../app/services';

@Component({
  selector: 'pleadings-page',
  templateUrl: './pleadings-page.component.html',
  styleUrls: ['./pleadings-page.component.scss']
})
export class PleadingsPageComponent extends AutoTrackViewComponent implements OnDestroy {
  dispute$: Observable<Dispute>;
  error$: Observable<Error>;
  loading$: Observable<boolean>;
  isExistsPleading$: Observable<boolean>;
  pleadings$: Observable<Array<Pleading>>;
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
      link: 'events',
      name: 'Events'
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
  public issueId: string;

  private disputeId: string;
  private componentDestroyed$: Subject<boolean> = new Subject();

  constructor(public route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private scrollToService: ScrollToService,
              private store: Store<fromStore.DisputeState>,
              private networkService: NetworkService,
              private routerService: RouterService) {
    super(route);

    this.getActiveMenu();
    this.selectDataFromStore();
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
    this.store.dispatch(new fromStore.UserLeftIssueView());
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

  private selectDataFromStore() {
    this.error$ = this.store.pipe(select(fromStore.selectPleadingError));
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
    this.loading$ = this.store.pipe(select(fromStore.selectPleadingsLoading));
    this.pleadings$ = this.store.pipe(select(fromStore.selectPleadingsByDispute));
    this.isExistsPleading$ = this.store.pipe(select(fromStore.checkIfPleadingExistedForSelectedDispute));
    this.activatedRoute$ = this.store.pipe(select(selectActivatedRoute));
  }

  private subscribeEvents() {
    this.error$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((error) => {
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

    this.activatedRoute$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((activatedRoute) => {
      if (activatedRoute) {
        this.disputeId = activatedRoute.params.disputeId;
        this.issueId = activatedRoute.params.issueId;
      }
    });
  }

  onSelectMenu(item: RightSideMenu) {
    this.activeMenu = item;
    this.router.navigate([item.link], {
      relativeTo: this.route
    });
  }

  onEditPleadings() {
    this.dialog.open(EditPleadingDialogComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'pleadings-full-screen-dialog',
      data: this.disputeId
    });
  }

  onAssignSentenceToIssue(data: AssignSentenceToIssueModel) {
    if (!this.issueId) {
      return;
    }
    const index = data.sentence.issueIds.includes(this.issueId);
    if (index) {
      this.store.dispatch(new fromStore.RemoveSentencesFromIssue(data));
    } else {
      const assignSentenceModel = _.cloneDeep(data);
      assignSentenceModel.sentence.issueIds.push(this.issueId);
      this.store.dispatch(new fromStore.AssignSentenceToIssue(assignSentenceModel));
    }
  }

  scrollToParagraph(id: string): void {
    const scrollToIssueInContentConfig: ScrollToConfigOptions = {
      container: 'paragraph-list',
      duration: 200,
      target: `paragraph-${id}`
    };

    const scrollToIssueInNavListConfig: ScrollToConfigOptions = {
      container: 'side-nav-paragraph-list',
      duration: 200,
      target: `side-nav-paragraph-${id}`
    };
    setTimeout(() => {
      this.scrollToService.scrollTo(scrollToIssueInNavListConfig).subscribe(
        () => {
        }, () => {
        },
        () => {
          this.scrollToService.scrollTo(scrollToIssueInContentConfig);
        });
    }, 100);

  }

  scrollToResponse(id: string): void {
    const config: ScrollToConfigOptions = {
      container: 'paragraph-list',
      duration: 200,
      target: `response-${id}`
    };
    this.scrollToService.scrollTo(config);
  }
}
