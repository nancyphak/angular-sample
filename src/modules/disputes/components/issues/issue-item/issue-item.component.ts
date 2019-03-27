import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';

import { ConfirmDialog, PromptDialog } from 'modules/shared';
import { Chronology, Evidence, Issue, Pleading } from '../../../models';
import * as fromStore from '../../../_store';
import { SaveChanges, UnSaveChanges } from '../../../../app/_store/actions';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'issue-item',
  templateUrl: './issue-item.component.html',
  styleUrls: ['./issue-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class IssueItemComponent {
  @Input() issue: Issue;
  @Input() evidence: Evidence[];
  @Input() pleadings: Pleading[];
  @Input() backBtn: boolean;
  @Input() activePleadingsPage: boolean;

  @Output() back: EventEmitter<Chronology> = new EventEmitter<Chronology>();

  editing = false;
  placeholderDrag = false;

  constructor(private store: Store<fromStore.DisputeState>,
              private router: Router,
              public dialog: MatDialog) {
  }

  onEditClicked() {
    this.openEditDialog();
  }

  onDeleteClicked() {
    this.openDeleteDialog();
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        text: this.issue.name,
        title: 'Rename Issue',
        placeholder: 'Issue Name',
        okButtonText: 'Rename'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.text && result.text !== this.issue.name) {
        const issue = _.cloneDeep(this.issue);
        issue.name = result.text;
        this.store.dispatch(new fromStore.UpdateIssue(issue));
        this.store.dispatch(new SaveChanges());
      }
    });
  }

  openDeleteDialog(): void {
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete ' + this.issue.name + '?',
        message: 'Are you sure you want to delete this issue?'
      }
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.store.dispatch(new fromStore.RemoveIssue({issue: this.issue}));
          this.deleteChildren(this.issue.children);
          this.store.dispatch(new SaveChanges());
        }
      });
  }

  deleteChildren(arr: Array<any>) {
    if (!arr || arr.length <= 0) {
      return;
    }
    from(arr).pipe(
      delay(2500)
    ).subscribe((item: any) => {
      const update = {
        id: item.id,
        disputeId: item.disputeId
      };
      this.store.dispatch(new fromStore.RemoveIssue({issue: update}));
      this.deleteChildren(item.children);
    });
  }

  onAddNotesClicked(): void {
    this.editing = true;
  }

  onRemoveNotesClicked(): void {
    this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: {
        title: 'Delete notes for ' + this.issue.name + '?',
        message: 'Are you sure you want to delete the notes for this issue?'
      }
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.store.dispatch(new fromStore.RemoveIssueNotes(this.issue));
          this.store.dispatch(new SaveChanges());
        }
      });
  }

  onSaveNotes(notes) {
    this.editing = false;
    if (this.issue.notes !== notes) {
      this.store.dispatch(new fromStore.SetIssueNotes({
        ...this.issue,
        notes: notes
      }));
    }
  }

  onFormChange(event) {
    if (event.saved) {
      this.store.dispatch(new SaveChanges());
    } else {
      this.store.dispatch(new UnSaveChanges());
    }
  }

  onBack() {
    this.back.emit();
  }

  onSelectEvidence(ev) {
    this.router.navigate(['/disputes', this.issue.disputeId, 'documents', ev.documentId, 'view', 'facts']);
  }

  onEvidenceDropped(event: CdkDragDrop<string[]>) {
    this.placeholderDrag = false;
    if (event.item.data.issueIds.includes(this.issue.id)) {
      return;
    }

    const evidence: Evidence = {
      ...event.item.data,
      issueIds: [this.issue.id, ...event.item.data.issueIds]
    };
    this.store.dispatch(new fromStore.UpdateEvidence(evidence));
  }

  onDropListEntered() {
    this.placeholderDrag = true;
  }

  onDropListExited() {
    this.placeholderDrag = false;
  }
}
