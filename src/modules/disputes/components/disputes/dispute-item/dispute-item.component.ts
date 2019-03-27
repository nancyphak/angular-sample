import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { ConfirmDialog, PromptDialog } from 'modules/shared';
import { Dispute } from '../../../models';

@Component({
  selector: 'dispute-item',
  templateUrl: './dispute-item.component.html',
  styleUrls: ['./dispute-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DisputeItemComponent {
  @Input() dispute: Dispute;
  @Output() remove: EventEmitter<Dispute> = new EventEmitter<Dispute>();
  @Output() update: EventEmitter<Dispute> = new EventEmitter<Dispute>();
  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialog: MatDialog) {
  }

  onClick() {
    this.select.emit(true);
  }

  onEditClicked() {
    this.openEditDialog();
  }

  onDeleteClicked() {
    this.openDeleteDialog();
  }

  private openEditDialog(): void {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        text: this.dispute.name,
        title: 'Rename Dispute',
        placeholder: 'Dispute Name',
        okButtonText: 'Rename'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.text && result.text !== this.dispute.name) {
        const dispute = _.cloneDeep(this.dispute);
        dispute.name = result.text;
        this.update.emit(dispute);
      }
    });
  }

  private openDeleteDialog(): void {
    this.dialog.open(ConfirmDialog,
      {
        data: {
          title: 'Delete ' + this.dispute.name + '?',
          message: 'Are you sure you want to delete this case?'
        },
        width: '350px'
      }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.remove.emit(this.dispute);
        }
      });
  }
}
