import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter, take, withLatestFrom, map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { NetworkService, PromptDialog } from 'modules/shared';
import { RouterService } from 'modules/app/services';
import { Error, selectActivatedRoute } from 'modules/app/_store';
import * as fromStore from '../../_store';
import { Dispute, Issue, RightSideMenu, IssueDetailModel, Person, SetIssueNotesHeightModel } from '../../models';
import { selectTreeIssues } from './issues-page.selectors';
import { BasePageComponent } from '../base-page/base-page.component';
import { IssuesEventService } from '../../services';

@Component({
  selector: 'issues-page',
  templateUrl: './issues-page.component.html',
  styleUrls: ['./issues-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class IssuesPageComponent extends BasePageComponent implements OnDestroy {
  issueTree$: Observable<any>;
  isExistsIssue$: Observable<boolean>;
  dispute$: Observable<Dispute>;
  error$: Observable<Error>;
  loading$: Observable<boolean>;
  issueDetail$: Observable<IssueDetailModel>;
  activatedRoute$: Observable<any>;
  rightSideMenu: Array<RightSideMenu> = [
    {
      link: 'events',
      name: 'Events'
    },
    {
      link: 'pleadings',
      name: 'Pleadings'
    },
    {
      link: 'people',
      name: 'People'
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
  private componentDestroyed$: Subject<boolean> = new Subject();

  constructor(public route: ActivatedRoute,
              public dialog: MatDialog,
              public store: Store<fromStore.DisputeState>,
              private router: Router,
              private snackBar: MatSnackBar,
              private issueEvent: IssuesEventService,
              private scrollToService: ScrollToService,
              private routerService: RouterService,
              private networkService: NetworkService) {
    super(route, store, dialog);

    this.getActiveMenu();
    this.selectDataFromStore();
    this.subscribeEvents();
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

  subscribeEvents() {
    this.issueEvent.onSelect.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((issue: Issue) => {
      this.router.navigate(['disputes', issue.disputeId, 'issues', issue.id, this.activeMenu.link]);
    });

    this.error$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((error) => {
      if (error) {
        const message = !this.networkService.isOnline.value ? `Couldn't refresh data while offline` : error.message;
        const snackBarRef = this.snackBar.open(message, 'Retry', {duration: 10000});
        snackBarRef.onAction().subscribe(() => {
          if (error.failedAction) {
            this.store.dispatch(error.failedAction);
          }
        });
      }
    });

    this.navigateToFirstIssue();
  }

  navigateToFirstIssue() {
    this.issueTree$.pipe(
      takeUntil(this.componentDestroyed$),
      withLatestFrom(this.route.params),
      filter(([issues, params]) => {
        return issues && issues.length > 0 && !params.issueId;
      }),
      map(([issues]) => issues[0]),
      take(1)
    ).subscribe((issue: Issue) => {
      this.router.navigate(['disputes', issue.disputeId, 'issues', issue.id]);
    });
  }

  selectDataFromStore() {
    this.issueDetail$ = this.store.pipe(select(fromStore.selectIssueDetail));
    this.issueTree$ = this.store.pipe(select(selectTreeIssues));
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
    this.isExistsIssue$ = this.store.pipe(select(fromStore.checkIfIssuesExistedForSelectedDispute));
    this.loading$ = this.store.pipe(select(fromStore.selectIssuesLoading));
    this.error$ = this.store.pipe(select(fromStore.selectIssueError));
    this.activatedRoute$ = this.store.pipe(select(selectActivatedRoute));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromStore.UserLeftIssueView());
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onSelectMenu(item: RightSideMenu) {
    this.activeMenu = item;
    this.router.navigate([item.link], {
      relativeTo: this.route
    });
  }

  onCreateBtnClick() {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Create Issue',
        placeholder: 'Issue Name',
        okButtonText: 'Create'
      }
    });

    dialogRef.afterClosed().pipe(
      withLatestFrom(this.activatedRoute$)
    ).subscribe(([result, route]) => {
      if (result.text) {
        const issue: Issue = {
          id: uuid(),
          name: result.text,
          disputeId: route.params.disputeId,
          notesHeightPreference: 0
        };
        this.store.dispatch(new fromStore.CreateIssue({
          issue: issue,
          options: {
            navigateToDetailOnSuccess: true
          }
        }));

        this.issueEvent.select(issue);
        this.scrollToIssuesElement(issue.id);
      }
    });
  }

  onSelectPerson(person: Person) {
    this.activeMenu = {
      name: 'People',
      link: 'people'
    };
    this.store.dispatch(new fromStore.SelectPerson(person));
  }

  private scrollToIssuesElement(issueId: string) {
    const scrollToIssueInNavListConfig: ScrollToConfigOptions = {
      container: 'side-nav-issue-list',
      duration: 200,
      target: `side-nav-issue-${issueId}`
    };
    setTimeout(() => {
      this.scrollToService.scrollTo(scrollToIssueInNavListConfig);
    }, 200);

  }

  onAddChildIssue(issue: Issue) {
    this.store.dispatch(new fromStore.CreateIssue({issue: issue}));
  }

  onSaveIssueName(issue: Issue) {
    this.store.dispatch(new fromStore.UpdateIssue(issue));
  }

  onSetIssueNotes(issue: Issue) {
    this.store.dispatch(new fromStore.SetIssueNotes(issue));

    if (!issue.notes) {
      const issueNotes = {
        disputeId: issue.disputeId,
        issueId: issue.id,
        height: 0
      };

      this.store.dispatch(new fromStore.SetIssueNotesHeight({issueNotes}));
    }
  }

  onSaveChildIssueName(issue: Issue) {
    this.store.dispatch(new fromStore.UpdateIssue(issue));
  }

  onSaveChildIssueNotes(issue: Issue) {
    this.store.dispatch(new fromStore.SetIssueNotes(issue));
  }

  onRemoveIssue(issue: Issue) {
    this.store.dispatch(new fromStore.RemoveIssue({
      issue: issue,
      options: {
        navigateToDetailOnSuccess: true
      }
    }));
  }

  onStopDragSplitView(issueNotes: SetIssueNotesHeightModel) {
    this.store.dispatch(new fromStore.SetIssueNotesHeight({issueNotes}));
  }
}
