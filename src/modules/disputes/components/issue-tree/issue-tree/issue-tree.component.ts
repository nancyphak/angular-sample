import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Issue } from '../../../models';
import * as fromStore from '../../../_store';
import { Store } from '@ngrx/store';
import { DragDropService } from '../drag-drop.service';

@Component({
  selector: 'issue-tree',
  templateUrl: './issue-tree.component.html',
  styleUrls: ['./issue-tree.component.css']
})
export class IssueTreeComponent implements OnInit {
  receiveSiblingAtEnd = false;
  @Input() tree: Array<Issue>;
  @Input() dropList: Array<any>;

  constructor(private store: Store<fromStore.DisputeState>,
              private render: Renderer2,
              private  dragDropService: DragDropService) {
  }

  ngOnInit() {
  }

  onDragoverLastElementDropzone(event) {
    const clientRect = this.dragDropService.draggingElement.value.getBoundingClientRect();
    if (event.y < clientRect.bottom
      && event.y > clientRect.top
      && event.x < clientRect.right
      && event.x > clientRect.left) {
      return;
    }

    event.dataTransfer.dropEffect = 'move';
    event.stopPropagation();
    event.preventDefault();
    this.receiveSiblingAtEnd = true;
    const draggingElement = this.dragDropService.draggingElement.value;
    this.render.setStyle(event.target, 'height', `${draggingElement.offsetHeight}px`);
  }

  onDragleaveLastElementDropzone(event: DragEvent) {
    event.preventDefault();
    this.receiveSiblingAtEnd = false;
    this.render.setStyle(event.target, 'height', `10px`);
  }

  onDropAfterIssue(event) {
    event.stopPropagation();
    event.preventDefault();
    this.store.dispatch(new fromStore.IssueDroppedAfterIssue({afterIssue: this.tree[this.tree.length - 1]}));
    this.receiveSiblingAtEnd = false;
    this.render.setStyle(event.target, 'height', `10px`);
  }

}
