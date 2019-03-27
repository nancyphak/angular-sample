import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Person } from '../../../models';

@Component({
  selector: 'select-person-dialog',
  templateUrl: './select-person-dialog.component.html',
  styleUrls: ['./select-person-dialog.component.scss']
})
export class SelectPersonDialogComponent {

  constructor(public dialogRef: MatDialogRef<SelectPersonDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public people: Array<Person>) {
  }

  onSubmit(): void {
    if (this.people) {
      this.dialogRef.close(this.people);
    }
  }

  onSelectionChange($event) {
    this.people.forEach((item: Person) => {
      if ($event.option.value.id === item.id) {
        item.selected = $event.option.selected;
      }
    });
  }
}
