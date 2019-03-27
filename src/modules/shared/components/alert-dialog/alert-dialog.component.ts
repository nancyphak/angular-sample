import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent {

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public message) {
  }
}
