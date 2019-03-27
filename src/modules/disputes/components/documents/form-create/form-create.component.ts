import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'form-create',
  templateUrl: './form-create.component.html',
  styleUrls: ['./form-create.component.scss']
})
export class FormCreateComponent {

  text: string;
  dateEvent: string;
  id: string;
  @Input() subTitle: string;
  @Input() novalidate: boolean;
  @Input() placeholder: string;

  @Output() cancel = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter<any>();
  @Output() formChange = new EventEmitter();

  onFormChange() {
    this.formChange.emit({
      saved: false
    });
  }

  onSubmit() {
    this.create.emit({
      text: this.text.trim(),
      date: this.dateEvent
    });
    this.formChange.emit({
      saved: true
    });
  }

  onCancel() {
    this.cancel.emit();
    this.formChange.emit({
      saved: true
    });
  }
}
