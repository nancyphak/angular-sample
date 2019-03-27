import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Issue } from '../../models';

const MaxLevel = 999999;

function getDepth(obj) {
  let depth = 0;
  if (obj.children) {
    obj.children.forEach(function (d) {
      const tmpDepth = getDepth(d);
      if (tmpDepth > depth) {
        depth = tmpDepth;
      }
    });
  }
  return 1 + depth;
}

@Injectable()
export class DragDropService {
  draggingElement = new BehaviorSubject(null);
  draggingIssue = new BehaviorSubject(null);

  constructor() {
  }

  checkDropable(dropTarget: Issue, eventType?) {
    const draggingIssue = this.draggingIssue.value;
    const depth = getDepth(draggingIssue);
    if (!draggingIssue || dropTarget.id === draggingIssue.id || depth === MaxLevel) {
      return false;
    }
    if (eventType === 'overOn') {
      if (dropTarget.level >= MaxLevel) {
        return false;
      }
      return depth + dropTarget.level <= MaxLevel;
    } else {
      return depth + dropTarget.level - 1 <= MaxLevel;
    }

  }

}
