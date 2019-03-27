import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dispute } from '../../../models';

@Component({
  selector: 'dispute-list',
  templateUrl: './dispute-list.component.html',
  styleUrls: ['./dispute-list.component.scss']
})
export class DisputeListComponent {
  @Input() disputes: Array<Dispute>;
  @Output() select: EventEmitter<Dispute> = new EventEmitter<Dispute>();
  @Output() update: EventEmitter<Dispute> = new EventEmitter<Dispute>();
  @Output() remove: EventEmitter<Dispute> = new EventEmitter<Dispute>();

  onSelect(dispute: Dispute): void {
    this.select.emit(dispute);
  }

  onUpdate(dispute: Dispute): void {
    this.update.emit(dispute);
  }

  onRemove(dispute: Dispute): void {
    this.remove.emit(dispute);
  }

}
