import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface PromptOptions {
  title?: string;
  text?: string;
  date?: string;
  placeholderDate?: string;
  placeholder?: string;
  okButtonText?: string;
  cancelButtonText?: string;
  maxLength?: number;
  required?: boolean;
  novalidate?: boolean;
  pattern?: string;
  errorMess?: string;
}

@Component({
  selector: 'prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent implements OnInit {
  options: PromptOptions = {
    title: '',
    text: '',
    date: '',
    placeholderDate: null,
    placeholder: '',
    okButtonText: '',
    cancelButtonText: 'Cancel',
    maxLength: 50,
    required: true,
    novalidate: false,
    pattern: null,
    errorMess: 'Not a valid pattern',
  };

  constructor(public dialogRef: MatDialogRef<PromptDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data?: PromptOptions) {

    this.options = {...this.options, ...data};
  }

  ngOnInit() {
    if (this.options.novalidate) {
      this.options.maxLength = undefined;
      this.options.required = false;
    }
  }

  onSubmit(): void {
    this.options.text = this.options.text.trim();
    this.dialogRef.close({
      text: this.options.text,
      date: this.options.date
    });
  }
}
