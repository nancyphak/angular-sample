import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { PleadingsService } from '../../../services';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'form-sentences-paragraph-dialog',
  templateUrl: './add-sentences-dialog.component.html',
  styleUrls: ['./add-sentences-dialog.component.scss']
})
export class AddSentencesDialogComponent {
  text: string;

  constructor(public dialogRef: MatDialogRef<AddSentencesDialogComponent>,
              private pleadingService: PleadingsService,
              @Inject(MAT_DIALOG_DATA) public title: string) {
  }

  onSubmit(): void {
    const arrayStr = this.splitSentences((this.text));
    if (arrayStr.length <= 0) {
      this.text = '';
      return;
    }
    const sentences = arrayStr.map((text) => {
      return {
        id: uuid(),
        text: text,
        issueIds: []
      };
    });
    this.dialogRef.close(sentences);

  }

  onSplitSentencesBtnClicked() {
    this.pleadingService.splitSentence(this.text).subscribe((res: any) => {
      if (res && res.sentences && res.sentences.length > 0) {
        this.text = res.sentences.join('\n\n');
      }
    });
  }

  private splitSentences(text: string) {
    if (!text) {
      return [];
    }
    const re = /\n/;
    let arrayStr = text.split(re);
    arrayStr = arrayStr.reduce((accumulator, currentValue) => {
      const str = currentValue.trim();
      if (str) {
        accumulator.push(str);
      }
      return accumulator;
    }, []);
    return arrayStr;
  }

}
