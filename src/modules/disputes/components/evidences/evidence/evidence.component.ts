import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from 'modules/shared';
import { Evidence } from '../../../models';

@Component({
  selector: 'evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.scss']
})
export class EvidenceComponent {
  @Input() evidence: Evidence;
  @Output() delete: EventEmitter<Evidence> = new EventEmitter<Evidence>();
  @Output() update: EventEmitter<Evidence> = new EventEmitter<Evidence>();

  constructor(public dialog: MatDialog) {
  }

  openDeleteDialog(): void {
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete',
        message: 'Are you sure you want to delete this evidence ?'
      }
    }).afterClosed().subscribe(confirm => {
      if (confirm) {
        this.delete.emit(this.evidence);
      }
    });
  }

  onUpdateClicked() {
    this.update.emit(this.evidence);
  }

}
