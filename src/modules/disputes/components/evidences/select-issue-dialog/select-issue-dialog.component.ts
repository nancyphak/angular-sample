import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { SelectableIssue } from '../form-evidence/form-evidence.component';

@Component({
  selector: 'select-issue-dialog',
  templateUrl: './select-issue-dialog.component.html',
  styleUrls: ['./select-issue-dialog.component.scss']
})
export class SelectIssueDialogComponent {
  constructor(public dialogRef: MatDialogRef<SelectIssueDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public issues: Array<SelectableIssue>) {
  }

  onSubmit(): void {
    this.dialogRef.close(this.issues);
  }

  onSelectionChange($event) {
    this.issues.forEach(item => {
      if ($event.option.value.id === item.id) {
        item.selected = $event.option.selected;
      }
    });
  }

}
