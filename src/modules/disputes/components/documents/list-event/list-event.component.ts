import { Component, Input, OnInit } from '@angular/core';
import { EventModel } from '../../../models';

@Component({
  selector: 'list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.scss']
})
export class ListEventComponent implements OnInit {
  @Input() events: Array<EventModel>;

  constructor() {
  }

  ngOnInit() {
  }

}
