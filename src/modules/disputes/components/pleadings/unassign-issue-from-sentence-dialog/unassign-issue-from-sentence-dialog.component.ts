import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EditSentenceDialogComponent } from '../edit-sentence-dialog/edit-sentence-dialog.component';

@Component({
  selector: 'unassign-issue-from-sentence-dialog',
  templateUrl: './unassign-issue-from-sentence-dialog.component.html',
  styleUrls: ['./unassign-issue-from-sentence-dialog.component.scss']
})
export class UnassignIssueFromSentenceDialogComponent {

  paragraphIds = [];
  responseIds = [];
  sentences = [];
  sentenceIds = [];
  responseId: Array<any> = [];

  constructor(public dialogRef: MatDialogRef<EditSentenceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public issue: any) {
  }

  onRemoveSentence(sentence, pleading, response) {
    if (response) {
      this.responseIds[response.id] = response.id;
      response.sentences = response.sentences.filter(item => item.id !== sentence.id);
      if (response.sentences.length <= 0) {
        pleading.responses = pleading.responses.filter(item => item.id !== response.id);
      }
    } else if (pleading) {
      pleading.sentences = pleading.sentences.filter(item => item.id !== sentence.id);
    }

    if (pleading.responses.length <= 0 && pleading.sentences.length <= 0) {
      this.issue.pleadings = this.issue.pleadings.filter(item => item.id !== pleading.id);
    }

    sentence.issueIds = sentence.issueIds.filter(id => id !== this.issue.id);
    this.sentences.push(sentence);
    this.sentenceIds.push(sentence.id);
    this.paragraphIds.push(pleading.id);
  }

  onSubmit() {
    if (this.sentences.length === 0) {
      this.dialogRef.close();
      return;
    }
    this.dialogRef.close({
      issueId: this.issue.id,
      paragraphIds: this.paragraphIds,
      sentenceIds: this.sentenceIds,
      sentences: this.sentences,
      responseIds: this.responseIds,
      disputeId: this.issue.disputeId
    });
  }

}
