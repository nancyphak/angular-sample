import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chip-list',
  template: `<div class="chip-list-wrapper"><ng-content></ng-content></div>`,
  styles: [`
  .chip-list-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipListComponent {
}
