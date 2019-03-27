import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDrawer, MatSnackBar } from '@angular/material';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { combineLatest } from 'rxjs/operators';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { appConfig } from '@app/config';
import { NetworkService } from 'modules/shared';
import { fileTypeDetection } from 'modules/shared/util';
import { Error } from 'modules/app/_store';
import { Dispute, DocumentMetadata, DocumentModel, FileUpload, Person } from '../../models';
import * as fromStore from '../../_store';
import { DocumentService } from '../../services';
import { SelectPersonDialogComponent } from '../../components';
import { documentTypes } from '../../constants';
import { BasePageComponent } from '../base-page/base-page.component';

@Component({
  selector: 'documents-page',
  templateUrl: './documents-page.component.html',
  styleUrls: ['./documents-page.component.scss']
})
export class DocumentsPageComponent extends BasePageComponent implements OnDestroy {
  @ViewChild('uploadPanel') uploadPanel: MatDrawer;

  loading$: Observable<boolean>;
  documentsLoading$: Observable<boolean>;
  error$: Observable<Error>;
  dispute$: Observable<Dispute>;
  documents$: Observable<Array<DocumentModel>>;
  documentMetadata$: Observable<any>;
  peopleAssociatedWithDocument$: Observable<Array<Person>>;
  selectedPeopleByDisputeId$: Observable<Array<Person>>;
  filesUploading$: Observable<Array<FileUpload>>;
  uploadsBarOpen$: Observable<boolean>;
  documentMetadataVisible$: Observable<boolean>;

  documentTypes = documentTypes;
  downloadLoading = false;
  fileOver = false;
  fileOverSideNav = false;
  showDocumentMetadataSidebar = false;
  currentSelectedPeopleId: Array<string> = [];
  selectedDocument: DocumentModel;
  acceptFileType = appConfig.acceptFileTypeToUploadHtml;
  peopleIds: Array<string>;
  filesUploading: Array<FileUpload> = [];

  private dispute: Dispute;
  private errorSubscription: Subscription;
  private listPeople: Array<Person> = [];

  constructor(public route: ActivatedRoute,
              public dialog: MatDialog,
              public store: Store<fromStore.DisputeState>,
              public snackBar: MatSnackBar,
              private docService: DocumentService,
              private networkService: NetworkService) {
    super(route, store, dialog);

    this.error$ = this.store.pipe(select(fromStore.selectDocumentError));
    this.dispute$ = this.store.pipe(select(fromStore.selectCurrentDispute));
    this.loading$ = this.store.pipe(select(fromStore.selectDocumentLoading));
    this.documentsLoading$ = this.store.pipe(select(fromStore.selectDocumentsLoading));

    this.documents$ = this.store.pipe(select(fromStore.selectDocumentsByDispute));
    this.documentMetadata$ = this.store.pipe(select(fromStore.selectDocumentMetadata));
    this.selectedPeopleByDisputeId$ = this.store.pipe(select(fromStore.selectPeopleByDispute));
    this.peopleAssociatedWithDocument$ = this.store.pipe(select(fromStore.selectPeopleAssociatedWithDocumentByDispute));
    this.documentMetadataVisible$ = this.store.pipe(select(fromStore.selectDocumentMetadataVisible));

    this.filesUploading$ = this.store.pipe(select(fromStore.selectFilesUploading));
    this.uploadsBarOpen$ = this.store.pipe(select(fromStore.selectUploadsVisible));

    this.documentMetadata$.subscribe(data => {
      if (data) {
        this.peopleIds = data.peopleIds;
        this.selectedDocument = data.document;
      }
    });

    this.dispute$.subscribe((dispute: Dispute) => {
      if (dispute) {
        this.dispute = dispute;
      }
    }).unsubscribe();

    this.errorSubscription = this.error$.subscribe((error) => {
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

    this.selectedPeopleByDisputeId$.pipe(
      combineLatest(this.peopleAssociatedWithDocument$)
    ).subscribe((data: any) => {
      const listPeople = _.cloneDeep(data[0]);
      const selectedPeople = _.cloneDeep(data[1]);
      this.currentSelectedPeopleId = selectedPeople.map((p: Person) => p.id);
      this.listPeople = listPeople.map(item => {
        selectedPeople.forEach(p => {
          if (item.id === p.id) {
            item.selected = true;
          }
        });
        return item;
      });
    });
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    this.store.dispatch(new fromStore.UserLeftDocumentPage());
  }

  onViewDocumentMetadata(document: DocumentModel) {
    this.store.dispatch(new fromStore.SelectDocument({id: document.id}));
  }

  onDownloadDocument(documentModel) {
    this.downloadLoading = true;

    this.docService.getDownloadDocumentUrl(documentModel.disputeId, documentModel.id).subscribe(res => {
      this.downloadLoading = false;
      const link = document.createElement('a');
      if (link.download !== undefined) {
        link.setAttribute('href', res.url);
        link.setAttribute('download', documentModel.name);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  onDeleteDocument(document: DocumentModel) {
    this.store.dispatch(new fromStore.DeleteDocument(document));
  }

  onAddOrRemovePeopleClick(): void {
    this.dialog.open(SelectPersonDialogComponent, {
      width: '350px',
      disableClose: true,
      data: _.cloneDeep(this.listPeople)
    }).afterClosed().subscribe((people: Array<Person>) => {
      if (people) {
        this.listPeople = people;
        const selectedPeople = this.listPeople.filter(item => item.selected);
        if (selectedPeople.length > 0) {
          const selectedPeopleIds: Array<string> = selectedPeople.map((p: Person) => p.id);
          this.peopleIds = selectedPeopleIds;
        } else {
          this.peopleIds = [];
        }

        const peopleUpdate = {
          disputeId: this.dispute.id,
          documentId: this.selectedDocument.id,
          peopleIds: this.peopleIds
        };
        this.store.dispatch(new fromStore.SetDocumentPeople(peopleUpdate));
      }
    });
  }

  onSaveDocumentMetadata(metadata: DocumentMetadata) {
    metadata.disputeId = this.dispute.id;
    metadata.documentId = this.selectedDocument.id;
    this.store.dispatch(new fromStore.SetDocumentMetadata(metadata));
  }

  onSaveDocumentDescription(event) {
    this.store.dispatch(new fromStore.SetDocumentDescription({
      ...this.selectedDocument,
      id: event.id,
      description: event.description
    }));
  }

  onFileDropped(files) {
    const filesArray = Array.from(files);
    const filesToUpload = [];
    filesArray.forEach((file: File) => {
      if (this.isValidFile(file)) {
        this.fileOver = false;
        this.fileOverSideNav = false;
        filesToUpload.push(file);
        if (this.snackBar) {
          this.snackBar.dismiss();
        }
      } else {
        this.snackBar.open('Only upload type file pdf', null, {duration: 10000});
        this.fileOver = false;
        this.fileOverSideNav = false;
      }
    });
    this.addToUpload(filesToUpload);
  }

  onFileSelected(files) {
    this.addToUpload(files);
  }

  onFileDragOver(event) {
    this.fileOver = event;
  }

  onCancelUploadItem(file: FileUpload) {
    this.store.dispatch(new fromStore.UploadCancel({id: file.id}));
  }

  private isValidFile(file: File): boolean {
    const fileType = fileTypeDetection(file.name);
    return appConfig.acceptFileTypeToUpload.indexOf(fileType) >= 0;
  }

  private addToUpload(files) {
    const filesArray = Array.from(files);
    const filesToUpload = [];
    filesArray.forEach((file: File) => {
      filesToUpload.push({
        disputeId: this.dispute.id,
        id: uuid(),
        file: file,
        fileName: file.name,
        fileType: fileTypeDetection(file.name),
        progress: 0,
        isSuccess: false,
        isCancel: false
      });
    });

    this.store.dispatch(new fromStore.Upload(filesToUpload));
  }

  trackByFn(index, item) {
    return item.id;
  }

  onBackdropClick() {
    this.store.dispatch(new fromStore.UploadsDismissed());
  }
}
