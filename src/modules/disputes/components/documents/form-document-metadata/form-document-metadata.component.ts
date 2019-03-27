import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DateAdapter, MatDialog } from '@angular/material';

import { AlertDialog } from 'modules/shared';
import { DocumentMetadata, DocumentModel, DocumentTypeModel, Person } from '../../../models';

@Component({
  selector: 'form-document-metadata',
  templateUrl: './form-document-metadata.component.html',
  styleUrls: ['./form-document-metadata.component.scss'],
})

export class FormDocumentMetadataComponent implements OnChanges {

  @Input() metadata: DocumentMetadata;
  @Input() document: DocumentModel;
  @Input() documents: Array<DocumentModel>;
  @Input() documentTypes: Array<DocumentTypeModel> = [];
  @Input() people: string;
  @Input() peopleByDispute: Person[];
  @Output() cancel = new EventEmitter();
  @Output() saveMetadata: EventEmitter<DocumentMetadata> = new EventEmitter<DocumentMetadata>();
  @Output() addOrRemovePeople: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() saveDescription: EventEmitter<any> = new EventEmitter<any>();

  model: DocumentMetadata = {};
  date: Date;
  dateDiscovery: Date;
  description: string;

  constructor(private dialog: MatDialog, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('de');
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.metadata && this.metadata) {
      this.date = null;
      this.dateDiscovery = null;
      this.model = {...this.metadata};
      const date = new Date(this.model.date);
      if (date && date.getFullYear() > 1) {
        this.date = new Date(this.model.date);
      }
      const dateDiscovery = new Date(this.model.dateDiscovery);
      if (dateDiscovery && dateDiscovery.getFullYear() > 1) {
        this.dateDiscovery = new Date(this.model.dateDiscovery);
      }
    }
    if (change.document && this.document) {
      this.description = this.document.description;
    }
  }

  onDocumentTypeChange() {
    this.saveMetadata.emit({...this.model});
  }

  onDocumentDateChange() {
    if (this.date !== null) {
      this.model.date = this.date;
    } else {
      this.model.date = undefined;
    }

    this.saveMetadata.emit({...this.model});
  }

  onDocumentDateDiscoveryChange() {
    if (this.dateDiscovery !== null) {
      this.model.dateDiscovery = this.dateDiscovery;
    } else {
      this.model.dateDiscovery = undefined;
    }

    this.saveMetadata.emit({...this.model});
  }

  isExistDocumentDescription(description): boolean {
    return this.documents.some((doc: DocumentModel) => {
      return doc.description === description;
    });
  }

  onAddOrRemovePeopleClicked() {
    this.addOrRemovePeople.emit();
  }

  onBlurDescription() {
    this.description = this.description.trim();
    if (!this.description) {
      return;
    }

    if (this.description !== this.document.description) {
      if (this.isExistDocumentDescription(this.description)) {
        this.dialog.open(AlertDialog, {
          width: '350px',
          data: 'Disallow duplicate descriptions'
        });
      } else {
        this.saveDescription.emit({
          description: this.description,
          id: this.document.id
        });
      }
    }
  }

  onSaveNotes(notes: string) {
    if (this.model.notes !== notes) {
      this.model.notes = notes;
      this.saveMetadata.emit({...this.model});
    }
  }

}
