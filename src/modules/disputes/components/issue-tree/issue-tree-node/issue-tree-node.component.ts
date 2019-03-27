import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../_store';
import { Evidence, Issue } from '../../../models';
import { DragDropService } from '../drag-drop.service';
import { IssuesEventService } from '../../../services';

@Component({
  selector: 'issue-tree-node',
  templateUrl: './issue-tree-node.component.html',
  styleUrls: ['./issue-tree-node.component.css']
})
export class IssueTreeNodeComponent implements OnInit {
  @Input() issue: Issue;
  @Input() dropList: Array<any>;

  dragging = false;
  receiveChild = false;
  receiveSiblingBefore = false;
  container: any;

  constructor(private store: Store<fromStore.DisputeState>,
              private render: Renderer2,
              private router: Router,
              public route: ActivatedRoute,
              private issueEvent: IssuesEventService,
              private  dragDropService: DragDropService) {
  }

  ngOnInit() {
    this.container = document.querySelector('#side-nav-issue-list');
  }

  onDragStart(event) {
    this.store.dispatch(new fromStore.IssueDragStarted({issue: this.issue}));
    this.dragDropService.draggingElement.next(event.target);
    this.dragDropService.draggingIssue.next(this.issue);
    event.stopPropagation();
    event.dataTransfer.setData('text', '');
    this.dragging = true;
  }

  onDrag(event: DragEvent) {
    event.stopPropagation();
    if (!this.dragging) {
      return;
    }
    const bounding = this.container.getBoundingClientRect();
    if (bounding.height - (event.clientY - bounding.top) <= 50) {
      this.container.scrollTop = this.container.scrollTop + 4;
      return;
    }
    if ((event.clientY - bounding.top) <= 50) {
      this.container.scrollTop = this.container.scrollTop - 4;
      return;
    }
  }

  onDragEnd(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    this.receiveChild = false;
    this.receiveSiblingBefore = false;
    this.dragDropService.draggingElement.next(null);
  }

  onDragoverBeforeDropzone(event) {
    if (!this.canDrop(event)) {
      return;
    }
    event.dataTransfer.dropEffect = 'move';
    event.stopPropagation();
    event.preventDefault();
    if (!this.dragging) {
      this.receiveChild = false;
      this.receiveSiblingBefore = true;
      const draggingElement = this.dragDropService.draggingElement.value;
      this.render.setStyle(event.target, 'height', `${draggingElement.offsetHeight}px`);
    }
  }

  onDragleaveBeforeDropzone(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.receiveSiblingBefore = false;
    this.render.setStyle(event.target, 'height', `10px`);
  }

  onDropBeforeIssue(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.store.dispatch(new fromStore.IssueDroppedBeforeIssue({beforeIssue: this.issue}));
    this.receiveChild = false;
    this.receiveSiblingBefore = false;
    this.render.setStyle(event.target, 'height', `10px`);
  }

  onDragoverIssue(event) {
    if (!this.canDrop(event)) {
      return;
    }
    event.dataTransfer.dropEffect = 'move';
    event.stopPropagation();
    if (!this.dragging && this.issue.children.length === 0) {
      event.preventDefault();
      this.receiveSiblingBefore = false;
      this.receiveChild = true;
    }
  }

  onDragleaveIssue() {
    this.receiveChild = false;
  }

  onDropIssue(event) {
    event.stopPropagation();
    this.store.dispatch(new fromStore.IssueDroppedOnIssue({targetIssue: this.issue}));
    event.preventDefault();
    this.receiveChild = false;
    this.receiveSiblingBefore = false;
  }

  onSelect(issue: Issue) {
    this.issueEvent.select(issue);
    this.store.dispatch(new fromStore.SelectIssue(issue.id));
  }

  canDrop(event) {
    const clientRect = this.dragDropService.draggingElement.value.getBoundingClientRect();
    if (event.y < clientRect.bottom
      && event.y > clientRect.top
      && event.x < clientRect.right
      && event.x > clientRect.left) {
      return;
    }
    return true;
  }

  onEvidenceDropped(event: CdkDragDrop<string[]>, issueId: string) {
    if (event.item.data.issueIds.includes(issueId)) {
      return;
    }
    const evidence: Evidence = {
      ...event.item.data,
      issueIds: [issueId, ...event.item.data.issueIds]
    };
    this.store.dispatch(new fromStore.UpdateEvidence(evidence));
  }
}
