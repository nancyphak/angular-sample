import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { DisputeBrowserEvidenceModel, Issue } from '../../../models';
import { SelectIssueDialogComponent as SelectIssueDialog } from '../select-issue-dialog/select-issue-dialog.component';

export interface SelectableIssue extends Issue {
  selected: boolean;
}

@Component({
  selector: 'evidence-inline-form',
  templateUrl: './evidence-inline-form.component.html',
  styleUrls: ['./evidence-inline-form.component.scss']
})
export class EvidenceInlineFormComponent implements OnInit, OnChanges {
  @Input() evidence: DisputeBrowserEvidenceModel;
  @Input() issues: Array<SelectableIssue>;
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  private listIssues: Array<SelectableIssue> = [];
  selectedIssues: Array<SelectableIssue> = [];
  pageNumber: number;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.getSelectedIssues();
  }

  ngOnChanges() {
    if (this.issues) {
      this.listIssues = _.cloneDeep(this.issues);
    }
    if (this.evidence) {
      this.pageNumber = this.evidence.pageNumber;
    }
  }

  private getSelectedIssues() {
    if (this.evidence) {
      this.evidence.issueIds.forEach(id => {
        this.listIssues.forEach(issue => {
          if (issue.id === id) {
            issue.selected = true;
            this.selectedIssues.push(issue);
          }
        });
      });
    }
  }

  onSaveText(text: string) {
    this.update.emit({
      ...this.evidence,
      text: text
    });
  }

  onSavePageNumber() {
    if (this.pageNumber < 1 || this.pageNumber > 5000) {
      return;
    }
    this.update.emit({
      ...this.evidence,
      pageNumber: this.pageNumber
    });
  }

  onRemoveIssue(issue: Issue) {
    this.update.emit({
      ...this.evidence,
      issueIds: this.evidence.issueIds.filter(id => id !== issue.id)
    });
  }

  onDeleteEvidence() {
    this.delete.emit(this.evidence);
  }

  onButtonAddIssueClicked() {
    this.dialog.open(SelectIssueDialog, {
      width: '350px',
      disableClose: true,
      data: _.cloneDeep(this.listIssues)
    }).afterClosed().subscribe((issues) => {
      if (issues) {
        this.listIssues = issues;
        const selectedIssues = this.listIssues.filter(item => item.selected);
        if (!_.isEqual(selectedIssues.sort(), this.selectedIssues.sort())) {
          this.selectedIssues = selectedIssues;
          this.update.emit({
            ...this.evidence,
            issueIds: this.selectedIssues.map(item => item.id)
          });
        }
      }
    });
  }
}
