import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Issue } from '../models';

@Injectable()
export class IssuesEventService {
  onSelect = new Subject();

  constructor() {
  }

  select(issue: Issue) {
    if (!issue || !issue.id) {
      return;
    }
    this.onSelect.next(issue);
  }
}

