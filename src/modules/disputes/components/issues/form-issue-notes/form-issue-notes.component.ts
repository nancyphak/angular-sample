import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'form-issue-notes',
  templateUrl: './form-issue-notes.component.html',
  styleUrls: ['./form-issue-notes.component.scss']
})
export class FormIssueNotesComponent implements AfterViewInit {
  @Input() notes: string;

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() formChange = new EventEmitter();

  @ViewChild('notesControl') notesControl: ElementRef;

  private editModel = false;
  private originNotes = null;

  ngAfterViewInit() {
    if (this.notes) {
      this.originNotes = this.notes;
      this.editModel = true;
    }

    setTimeout(() => {
      this.notesControl.nativeElement.focus();
    });
  }

  onFormChange() {
    const newNotes = this.notes.trim();
    if (newNotes !== this.originNotes) {
      this.formChange.emit({
        saved: false
      });
    }
  }

  onSubmit() {
    this.notes = this.notes.trim();
    this.save.emit(this.notes);
    this.formChange.emit({
      saved: true
    });
  }

  onCancel() {
    this.cancel.emit(true);
    this.formChange.emit({
      saved: true
    });
  }
}

