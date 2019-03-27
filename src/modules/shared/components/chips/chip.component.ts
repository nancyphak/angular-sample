import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chip',
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      margin: 4px;
      flex-shrink: 0;
      display: inline-flex;
      padding: 7px 12px;
      border-radius: 16px;
      align-items: center;
      min-height: 32px;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0,0,0,.87);
      cursor: pointer;
      user-select: none;
    }
  `]
})
export class ChipComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }
}
