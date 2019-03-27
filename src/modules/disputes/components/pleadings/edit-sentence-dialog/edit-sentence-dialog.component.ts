import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'edit-sentence-dialog',
  templateUrl: './edit-sentence-dialog.component.html',
  styleUrls: ['./edit-sentence-dialog.component.scss']
})
export class EditSentenceDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditSentenceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public text: string) {
  }

  onSubmit(): void {
    this.text = this.text.trim();
    this.dialogRef.close(this.text);
  }

}
