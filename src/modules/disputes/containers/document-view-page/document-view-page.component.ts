import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, Subject, Subscription } from 'rxjs';
import { withLatestFrom, map, takeUntil } from 'rxjs/operators';

import { Error, selectActivatedRoute } from 'modules/app/_store';
import { RouterService } from 'modules/app/services';
import { AutoTrackViewComponent } from 'modules/shared';
import { NetworkService } from 'modules/shared/services';
import { Dispute, DocumentModel, RightSideMenu } from '../../models';
import * as fromStore from '../../_store';
import { DocumentService } from '../../services';

@Component({
  selector: 'document-view-page',
  templateUrl: './document-view-page.component.html',
  styleUrls: ['./document-view-page.component.scss']
})
export class DocumentViewPageComponent extends AutoTrackViewComponent implements OnInit, OnDestroy {

  disputeId: string;
  documentId: string;
  selectedDocument: DocumentModel;

  pdfSrc: string;

  loading$: Observable<boolean>;
  error$: Observable<Error>;
  dispute$: Observable<Dispute>;
  selectedDocument$: Observable<DocumentModel>;
  activatedRoute$: Observable<any>;

  rightSideMenu: Array<RightSideMenu> = [
    {
      link: 'details',
      name: 'Details'
    },
    {
      link: 'facts',
      name: 'Facts'
    },
    {
      link: 'issues',
      name: 'Issues'
    },
    {
      link: 'events',
      name: 'Events'
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
    }
  ];
  activeMenu: RightSideMenu;
  private componentDestroyed$: Subject<boolean> = new Subject();

  private errorSubscription: Subscription;

  constructor(public route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private router: Router,
    private docService: DocumentService,
    private store: Store<fromStore.DisputeState>,
    private routerService: RouterService,
    private networkService: NetworkService) {
    super(route);
    this.loading$ = this.store.pipe(select(fromStore.selectDocumentLoading));
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
    this.selectedDocument$ = this.store.pipe(select(fromStore.selectCurrentDocument));
    this.error$ = this.store.pipe(select(fromStore.selectDocumentError));
    this.activatedRoute$ = this.store.pipe(select(selectActivatedRoute));

    route.params.pipe(
      withLatestFrom(this.dispute$),
      map(([params, dispute]) => {
        return {
          disputeId: dispute.id,
          documentId: params.documentId
        };
      }),
      takeUntil(this.componentDestroyed$)
    ).subscribe((params) => {
      this.disputeId = params.disputeId;
      this.documentId = params.documentId;
      this.docService.getDownloadDocumentUrl(this.disputeId, this.documentId).subscribe((res: any) => {
        if (res) {
          this.pdfSrc = res.url;
        }
      });
    });

    this.store.dispatch(new fromStore.ChangeCurrentPageNumber(1));

    this.selectedDocument$.subscribe((document) => {
      this.selectedDocument = document;
    });

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
        const snackBarRef = this.snackBar.open(message, 'Retry', { duration: 10000 });
        snackBarRef.onAction().subscribe(() => {
          if (error.failedAction) {
            this.store.dispatch(error.failedAction);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    this.store.dispatch(new fromStore.UserLeftDocumentViewPage());
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onDownloadClicked() {

    if (this.pdfSrc && this.selectedDocument) {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        link.setAttribute('href', this.pdfSrc);
        link.setAttribute('download', this.selectedDocument.name);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      this.snackBar.open('Please wait for get document url');
    }
  }

  onSelectMenu(item: RightSideMenu) {
    this.activeMenu = {
      name: item.name
    };
    this.router.navigate([item.link], {
      relativeTo: this.route
    });
  }

  onBackDocuments() {
    this.router.navigate(['disputes', this.disputeId, 'documents']);
  }

  onSelectIssueToEvidence(event) {
    if (event.selectEvidence) {
      this.activeMenu = {
        name: 'facts'
      };
    }
  }

  onPageChange(pageNumber: number) {
    this.store.dispatch(new fromStore.ChangeCurrentPageNumber(pageNumber));
  }

}
