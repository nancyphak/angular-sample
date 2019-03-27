import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from 'modules/shared';
import { Sentence } from '../../../models';
import { EditSentenceDialogComponent } from '../edit-sentence-dialog/edit-sentence-dialog.component';
import { AddSentencesDialogComponent } from '../add-sentences-dialog/add-sentences-dialog.component';

@Component({
  selector: 'sentence',
  templateUrl: './sentence.component.html',
  styleUrls: ['./sentence.component.scss']
})
export class SentenceComponent {
  @Input() sentence: Sentence;
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();
  @Output() insertSentences: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {
  }

  onEditClicked() {
    const dialogRef = this.dialog.open(EditSentenceDialogComponent, {
      width: '650px',
      disableClose: true,
      data: this.sentence.text
    });

    dialogRef.afterClosed().subscribe((text: string) => {
      if (text && text !== this.sentence.text) {
        this.update.emit({
          ...this.sentence,
          text
        });
      }
    });
  }

  onRemoveClicked() {
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete sentence?',
        message: 'Are you sure you want to delete this sentence?'
      }
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.remove.emit(this.sentence);
        }
      });
  }

  onAddSentenceBeforeClicked() {
    const dialogRef = this.dialog.open(AddSentencesDialogComponent, {
      width: '650px',
      disableClose: true,
      data: 'Add sentences before'
    });

    dialogRef.afterClosed().subscribe((sentences: Array<any>) => {
      if (sentences) {
        this.insertSentences.emit({
          addBefore: this.sentence.id,
          sentences: sentences
        });
      }
    });
  }

  onAddSentenceAfterClicked() {
    const dialogRef = this.dialog.open(AddSentencesDialogComponent, {
      width: '650px',
      disableClose: true,
      data: 'Add sentences after'
    });

    dialogRef.afterClosed().subscribe((sentences: Array<any>) => {
      if (sentences) {
        this.insertSentences.emit({
          addAfter: this.sentence.id,
          sentences: sentences
        });
      }
    });
  }
}


