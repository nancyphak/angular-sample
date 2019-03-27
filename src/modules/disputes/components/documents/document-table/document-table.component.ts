import {
  AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';

import { ConfirmDialog } from 'modules/shared';
import { DocumentModel } from '../../../models';

@Component({
  selector: 'document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss']
})
export class DocumentTableComponent implements AfterViewInit, OnChanges {

  @ViewChild(MatSort) sort: MatSort;
  @Input() documents: Array<DocumentModel>;
  @Output() delete: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();
  @Output() viewMeta: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();
  @Output() download: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  dataSource = new MatTableDataSource<DocumentModel>(this.documents);
  selectedRowIndex = 1;
  displayedColumns = ['description', 'documentType', 'actions'];

  constructor(private dialog: MatDialog, private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documents'] && this.documents) {
      this.dataSource = new MatTableDataSource<DocumentModel>(this.documents);
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onDeleteClicked(document: DocumentModel): void {
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete ' + document.description + '?',
        message: 'Are you sure you want to delete this document?'
      }
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.delete.emit(document);
        }
      });
  }

  viewDocument(document) {
    this.router.navigate([`${this.router.url}/${document.id}/view`]);
  }

  viewDocumentMetadata(document) {
    this.selectedRowIndex = document.id;
    this.viewMeta.emit(document);
  }

  downloadDocument(document) {
    this.download.emit(document);
  }

}
