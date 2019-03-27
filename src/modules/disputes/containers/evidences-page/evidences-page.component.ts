import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Error } from '../../../app/_store';
import * as fromStore from '../../_store';
import { Evidence, EvidencesPageModel, Person, RightSideMenu, Issue } from '../../models';
import { ConfirmDialog, NetworkService } from '../../../shared';
import { BasePageComponent } from '../base-page/base-page.component';
import { selectEvidencesForEvidencesPage } from './evidences-page.selector';
import { RouterService } from '../../../app/services';

@Component({
  selector: 'evidences-page',
  templateUrl: './evidences-page.component.html',
  styleUrls: ['./evidences-page.component.scss']
})
export class EvidencesPageComponent extends BasePageComponent implements OnDestroy {
  error$: Observable<Error>;
  loading$: Observable<boolean>;
  isExistsEvidence$: Observable<boolean>;
  evidences$: Observable<Array<EvidencesPageModel>>;
  issueIds$: Observable<Array<any>>;
  isDragging$: Observable<boolean>;

  public dropList = ['issueDrop'];

  public rightSideMenu: Array<RightSideMenu> = [
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
      link: 'events',
      name: 'Events'
    },
    {
      link: 'docs',
      name: 'Docs'
    }
  ];
  public activeMenu = this.rightSideMenu[0];

  public issueId: string;
  private componentDestroyed$: Subject<boolean> = new Subject();

  constructor(public route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              public store: Store<fromStore.DisputeState>,
              private networkService: NetworkService,
              private snackBar: MatSnackBar,
              private routerService: RouterService) {
    super(route, store, dialog);

    this.selectDataFromStore();
    this.getActiveMenu();
    this.subscribeEvents();
  }

  private selectDataFromStore() {
    this.error$ = this.store.pipe(select(fromStore.selectEvidencesError));
    this.loading$ = this.store.pipe(select(fromStore.selectEvidenceLoading));
    this.evidences$ = this.store.pipe(select(selectEvidencesForEvidencesPage));
    this.isExistsEvidence$ = this.store.pipe(select(fromStore.checkIfEvidenceExistedForSelectedDispute));
    this.issueIds$ = this.store.pipe(select(fromStore.selectIssueIds));
    this.isDragging$ = this.store.pipe(select(fromStore.selectEvidencesIsDragging));
  }

  private getActiveMenu() {
    this.routerService.rightPanelPath$.subscribe((path) => {
      if (path) {
        const name = path.split('/')[0];
        this.activeMenu = {
          name: name.toLowerCase(),
          link: path
        };
      }
    });
  }

  private subscribeEvents() {
    this.issueIds$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe(issueIds => {
      issueIds.forEach(issueId => {
        this.dropList.push('issueTreeDrop-' + issueId);
      });
    });

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
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onSelectMenu(item: RightSideMenu) {
    this.activeMenu = item;
    this.router.navigate([item.link], {
      relativeTo: this.route
    });
  }

  onDeleteEvidence(evidence: Evidence): void {
    let text = evidence.text;
    if (evidence.text.length > 200) {
      text = evidence.text.substr(0, 200) + '...';
    }
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete fact?',
        message: `<p>Are you sure you want to delete the following fact?</p>
                  <p><i>${text}</i></p>`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    }).afterClosed().subscribe((data) => {
      if (data) {
        this.store.dispatch(new fromStore.DeleteEvidence(evidence));
      }
    });
  }

  onUpdateEvidence(evidence: Evidence) {
    this.store.dispatch(new fromStore.UpdateEvidence(evidence));
  }

  onSelectPerson(person: Person) {
    this.activeMenu = {
      name: 'People',
      link: 'people'
    };
    this.store.dispatch(new fromStore.SelectPerson(person));
    this.router.navigate(['disputes', person.disputeId, 'facts', 'people', person.id]);
  }

  onSelectIssue(issue: Issue) {
    this.activeMenu = {
      name: 'Issues',
      link: 'issues'
    };
    this.store.dispatch(new fromStore.SelectIssue(issue.id));
    this.router.navigate(['/disputes', issue.disputeId, 'facts', 'issues', issue.id]);
  }

  startDrag() {
    this.store.dispatch(new fromStore.EvidenceDragStarted());
  }

  endDrag() {
    this.store.dispatch(new fromStore.EvidenceDropped());
  }
}
