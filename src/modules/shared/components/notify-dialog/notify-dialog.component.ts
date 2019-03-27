import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface NotifyOptions {
  title?: string;
  message?: string;
  notifyButtonText?: string;
}

@Component({
  selector: 'notify-dialog',
  templateUrl: './notify-dialog.component.html',
  styleUrls: ['./notify-dialog.component.scss'],
})
export class NotifyDialogComponent {
  options: NotifyOptions = {
    title: 'Notification',
    message: '',
    notifyButtonText: 'OK',
  };

  constructor(public dialogRef: MatDialogRef<NotifyDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data?: NotifyOptions) {

    this.options = {...this.options, ...data};
  }
}
