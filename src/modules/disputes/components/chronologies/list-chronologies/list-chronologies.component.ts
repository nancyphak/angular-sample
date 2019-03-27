import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chronology, DocumentMetadata, EventModel, EventTypes } from '../../../models';
import { PromptDialog, ConfirmDialog } from 'modules/shared';

import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'list-chronologies',
  templateUrl: './list-chronologies.component.html',
  styleUrls: ['./list-chronologies.component.scss']
})
export class ListChronologiesComponent {
  @Input() events: Array<EventModel>;

  @Output() remove: EventEmitter<Chronology> = new EventEmitter<Chronology>();
  @Output() update: EventEmitter<Chronology> = new EventEmitter<Chronology>();

  description: string;
  date: any;
  model: DocumentMetadata = {};
  customEvent = EventTypes.customEvent;

  constructor(private dialog: MatDialog) {
  }

  onEditClicked(event) {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Update Event',
        text: event.description,
        date: event.date,
        placeholder: 'Description',
        placeholderDate: 'Choose a date',
        okButtonText: 'Save'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.text !== event.description || result.date !== event.date)) {
        const updateEvent = _.cloneDeep(event);
        updateEvent.description = result.text;
        updateEvent.date = result.date;
        this.update.emit({
          disputeId: updateEvent.disputeId,
          id: updateEvent.id,
          description: updateEvent.description,
          date: updateEvent.date
        });
      }

    });
  }

  onRemoveClicked(event) {
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete ' + event.description + '?',
        message: 'Are you sure you want to delete this event?'
      }
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.remove.emit(event);
        }
      });
  }
}
