import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { ConfirmDialog, PromptDialog } from 'modules/shared';
import { Pleading, Response, Sentence } from '../../../models';
import { AddSentencesDialogComponent } from '../add-sentences-dialog/add-sentences-dialog.component';

@Component({
  selector: 'pleading-item',
  templateUrl: './pleading-item.component.html',
  styleUrls: ['./pleading-item.component.scss']
})
export class PleadingItemComponent {
  @Input() pleading: Pleading;

  @Output() addSentencesParagraph: EventEmitter<any> = new EventEmitter();
  @Output() addSentencesResponse: EventEmitter<any> = new EventEmitter();
  @Output() updateParagraph: EventEmitter<Pleading> = new EventEmitter();
  @Output() removeParagraph: EventEmitter<Pleading> = new EventEmitter();
  @Output() createResponse: EventEmitter<Response> = new EventEmitter();
  @Output() removeResponse: EventEmitter<any> = new EventEmitter();
  @Output() updateResponse: EventEmitter<any> = new EventEmitter();
  @Output() updateSentence: EventEmitter<any> = new EventEmitter();
  @Output() removeSentence: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) {
  }

  onAddSentencesForParagraphClick() {
    const dialogRef = this.dialog.open(AddSentencesDialogComponent, {
      width: '650px',
      disableClose: true,
      data: this.pleading.title
    });

    dialogRef.afterClosed().subscribe((sentences: Array<any>) => {
      if (sentences) {
        this.addSentencesParagraph.emit({
          disputeId: this.pleading.disputeId,
          paragraphId: this.pleading.id,
          sentences: sentences
        });
      }
    });
  }

  onAddSentencesForResponseClick(response: Response) {
    const dialogRef = this.dialog.open(AddSentencesDialogComponent, {
      width: '650px',
      disableClose: true,
      data: response.title
    });

    dialogRef.afterClosed().subscribe((sentences: Array<any>) => {
      if (sentences) {
        this.addSentencesResponse.emit({
          responseId: response.id,
          disputeId: this.pleading.disputeId,
          paragraphId: this.pleading.id,
          sentences: sentences
        });
      }
    });
  }

  onRenameParagraphClicked(): void {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        text: this.pleading.title,
        title: 'Rename Paragraph',
        placeholder: 'Title',
        okButtonText: 'Rename'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.text && result.text !== this.pleading.title) {
        const pleading = _.cloneDeep(this.pleading);
        pleading.title = result.text;
        this.updateParagraph.emit(pleading);
      }
    });
  }

  onDeleteParagraphClicked() {
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete ' + this.pleading.title + '?',
        message: 'Are you sure you want to delete this paragraph?'
      }
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.removeParagraph.emit(this.pleading);
        }
      });
  }

  onDeleteResponseClicked(response: Response) {
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete ' + response.title + '?',
        message: 'Are you sure you want to delete this Response?'
      }
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.removeResponse.emit({
            ...response,
            disputeId: this.pleading.disputeId,
            paragraphId: this.pleading.id
          });
        }
      });
  }

  onAddResponseClicked() {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Create Response',
        placeholder: 'Title',
        okButtonText: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.text) {
        const response: any = {
          id: uuid(),
          title: result.text,
          paragraphId: this.pleading.id,
          disputeId: this.pleading.disputeId,
          sentences: []
        };
        this.createResponse.emit(response);
      }
    });
  }

  onRenameResponse(response: Response): void {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        text: response.title,
        title: 'Rename Response',
        placeholder: 'Title',
        okButtonText: 'Rename'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.text !== response.title) {
        const updateResponse = _.cloneDeep(response);
        updateResponse.title = result.text;
        this.updateResponse.emit({
          ...updateResponse,
          disputeId: this.pleading.disputeId,
          paragraphId: this.pleading.id
        });
      }
    });
  }

  onUpdateSentence(sentence: Sentence, responseId?: string) {
    this.updateSentence.emit({
      sentence,
      responseId: responseId,
      disputeId: this.pleading.disputeId,
      paragraphId: this.pleading.id
    });
  }

  onRemoveSentence(sentence: Sentence, responseId?: string) {
    this.removeSentence.emit({
      sentence,
      responseId: responseId,
      disputeId: this.pleading.disputeId,
      paragraphId: this.pleading.id
    });
  }

  onInsertSentencesForResponse(event: {
    sentences: Array<Sentence>
    addAfter?: string,
    addBefore?: string,
  }, response?: Response): void {

    let beforeSentenceId: string;

    if (event.addBefore) {
      beforeSentenceId = event.addBefore;
    } else if (event.addAfter) {
      if (response && response.id) {
        const index = response.sentences.findIndex(sentence => sentence.id === event.addAfter);
        if (index < response.sentences.length - 1) {
          beforeSentenceId = response.sentences[index + 1].id;
        }
      }
    }

    this.addSentencesResponse.emit({
      responseId: response.id,
      beforeSentenceId: beforeSentenceId,
      disputeId: this.pleading.disputeId,
      paragraphId: this.pleading.id,
      sentences: event.sentences
    });
  }

  onInsertSentencesForParagraph(event: {
    sentences: Array<Sentence>
    addAfter?: string,
    addBefore?: string,
  }): void {

    let beforeSentenceId;

    if (event.addBefore) {
      beforeSentenceId = event.addBefore;
    } else if (event.addAfter) {
      const index = this.pleading.sentences.findIndex(sentence => sentence.id === event.addAfter);
      if (index < this.pleading.sentences.length - 1) {
        beforeSentenceId = this.pleading.sentences[index + 1].id;
      }
    }

    this.addSentencesParagraph.emit({
      beforeSentenceId: beforeSentenceId,
      disputeId: this.pleading.disputeId,
      paragraphId: this.pleading.id,
      sentences: event.sentences
    });
  }
}
