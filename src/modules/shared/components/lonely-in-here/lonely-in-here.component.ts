import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lonely-in-here',
  templateUrl: './lonely-in-here.component.html',
  styleUrls: ['./lonely-in-here.component.scss']
})
export class LonelyInHereComponent {
  @Input() title = `It's lonely in here!`;
  @Input() subTitle: string;
  @Input() message: string;
  @Input() actionName: string;
  @Input() disabled: boolean;

  @Output() action: EventEmitter<any> = new EventEmitter();

  onActionBtnClick() {
    this.action.emit(true);
  }

}
