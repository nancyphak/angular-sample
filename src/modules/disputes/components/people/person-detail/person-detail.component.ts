import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chronology, PersonDetailViewModel } from '../../../models';

@Component({
  selector: 'person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.scss']
})
export class PersonDetailComponent {
  @Input() person: PersonDetailViewModel;
  @Input() removeBtn: any;

  @Output() back: EventEmitter<Chronology> = new EventEmitter<Chronology>();

  onBack() {
    this.back.emit();
  }
}
