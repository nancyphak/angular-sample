import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { AuthService } from 'modules/auth/services';
import { Error } from 'modules/app/_store';
import { AutoTrackViewComponent, PromptDialog } from 'modules/shared';
import { NetworkService } from 'modules/shared/services';
import { Dispute, Pleading, Response } from '../../../models';
import * as fromStore from '../../../_store';

@Component({
  selector: 'edit-pleading-dialog',
  templateUrl: './edit-pleading-dialog.component.html',
  styleUrls: ['./edit-pleading-dialog.component.scss']
})
export class EditPleadingDialogComponent extends AutoTrackViewComponent implements OnInit, OnDestroy {
  dispute$: Observable<Dispute>;
  error$: Observable<Error>;
  loading$: Observable<boolean>;
  isExistsPleading$: Observable<boolean>;
  pleadings$: Observable<Array<Pleading>>;

  public paragraphIds: string[];
  public response: Response;

  private componentDestroyed$: Subject<boolean> = new Subject();

  constructor(public auth: AuthService,
              public route: ActivatedRoute,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private scrollToService: ScrollToService,
              private store: Store<fromStore.DisputeState>,
              public dialogRef: MatDialogRef<EditPleadingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public disputeId,
              private networkService: NetworkService) {
    super(route);

    this.error$ = this.store.pipe(select(fromStore.selectPleadingError));
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
    this.loading$ = this.store.pipe(select(fromStore.selectPleadingsLoading));
    this.pleadings$ = this.store.pipe(select(fromStore.selectPleadingsByDispute));
    this.isExistsPleading$ = this.store.pipe(select(fromStore.checkIfPleadingExistedForSelectedDispute));
  }

  ngOnInit() {
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

    this.store.pipe(
      select(fromStore.selectParagraphParagraphIds),
      takeUntil(this.componentDestroyed$)
    ).subscribe((paragraphIds: string[]) => {
      this.paragraphIds = [...paragraphIds];
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onCreateParagraphClick() {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Create Paragraph',
        placeholder: 'Title',
        okButtonText: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.text) {
        const pleading: Pleading = {
          id: uuid(),
          title: result.text,
          disputeId: this.disputeId,
          responses: [],
          sentences: []
        };
        this.store.dispatch(new fromStore.CreateParagraph(pleading));
        setTimeout(() => {
          this.scrollToParagraph(pleading.id);
        }, 200);
      }
    });
  }

  onUpdateParagraph(paragraph: Pleading): void {
    this.store.dispatch(new fromStore.UpdateParagraph(paragraph));
  }

  onRemoveParagraph(paragraph: Pleading): void {
    this.store.dispatch(new fromStore.RemoveParagraph(paragraph));
  }

  onCreateResponse(response: Response): void {
    this.store.dispatch(new fromStore.CreateResponse(response));
    setTimeout(() => {
      this.scrollToResponse(response.id);
    }, 200);
  }

  onUpdateResponse(response: Response): void {
    this.store.dispatch(new fromStore.UpdateResponse(response));
  }

  onRemoveResponse(response: Response): void {
    this.store.dispatch(new fromStore.RemoveResponse(response));
  }

  onAddSentencesParagraph(sentences) {
    this.store.dispatch(new fromStore.AddParagraphSentences(sentences));
  }

  onAddSentencesResponse(sentences) {
    this.store.dispatch(new fromStore.AddResponseSentences(sentences));
  }

  onUpdateSentence(sentence): void {
    this.store.dispatch(new fromStore.UpdateSentence(sentence));
  }

  onRemoveSentence(sentence): void {
    this.store.dispatch(new fromStore.RemoveSentence(sentence));
  }

  onDroppedSentence(data) {
    this.store.dispatch(new fromStore.AssignSentenceToIssue(data));
  }

  onParagraphDrop(paragraphIds) {
    this.store.dispatch(new fromStore.SetParagraphOrder({
      disputeId: this.disputeId,
      paragraphIds: [...paragraphIds]
    }));
  }

  scrollToParagraph(id: string): void {
    const scrollToIssueInContentConfig: ScrollToConfigOptions = {
      container: 'paragraph-list-dialog',
      duration: 200,
      target: `paragraph-dialog-${id}`
    };

    const scrollToIssueInNavListConfig: ScrollToConfigOptions = {
      container: 'side-nav-paragraph-list-dialog',
      duration: 200,
      target: `side-nav-paragraph-dialog-${id}`
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
      container: 'paragraph-list-dialog',
      duration: 200,
      target: `response-dialog-${id}`
    };
    this.scrollToService.scrollTo(config);
  }

}
