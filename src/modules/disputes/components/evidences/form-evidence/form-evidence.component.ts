import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { v4 as uuid } from 'uuid';
import * as _ from 'lodash';

import { CreateEvidenceModel, Evidence, Issue } from '../../../models';
import { SelectIssueDialogComponent as SelectIssueDialog } from '../select-issue-dialog/select-issue-dialog.component';

export interface SelectableIssue extends Issue {
  selected: boolean;
}

@Component({
  selector: 'form-evidence',
  templateUrl: './form-evidence.component.html',
  styleUrls: ['./form-evidence.component.scss']
})
export class FormEvidenceComponent implements OnChanges, OnInit {
  @Input() issues: Array<SelectableIssue>;
  @Input() evidence: Evidence;
  @Output() create: EventEmitter<CreateEvidenceModel> = new EventEmitter();
  @Output() update: EventEmitter<Evidence> = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() formChange = new EventEmitter();

  selectedIssues: Array<SelectableIssue> = [];
  evidenceModel: CreateEvidenceModel;

  private editMode = false;
  private listIssues: Array<SelectableIssue> = [];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.initFormModel();
    this.getSelectedIssues();
  }

  ngOnChanges() {
    if (this.issues) {
      this.listIssues = _.cloneDeep(this.issues);
    }
  }

  onFormChange() {
    this.formChange.emit({
      saved: false
    });
  }

  onSubmit() {
    const issueIds = this.selectedIssues.map(item => item.id);

    if (this.editMode) {
      const update: Evidence = {
        ...this.evidence,
        text: this.evidenceModel.Text,
        pageNumber: this.evidenceModel.PageNumber,
        issueIds: issueIds,
        issues: this.selectedIssues
      };
      this.update.emit(update);
    } else {
      const evidenceModel: CreateEvidenceModel = {
        ...this.evidenceModel,
        IssueIds: issueIds
      };
      this.create.emit(evidenceModel);
    }

    this.formChange.emit({
      saved: true
    });
  }

  onCancel() {
    this.cancel.emit();
    this.formChange.emit({
      saved: true
    });
  }

  onLinkIssueBtnClicked(): void {
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
          this.formChange.emit({
            saved: false
          });
        }
      }
    });
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

  private initFormModel() {
    if (this.evidence) {
      this.editMode = true;
      this.evidenceModel = {
        EvidenceId: this.evidence.id,
        Text: this.evidence.text,
        PageNumber: this.evidence.pageNumber,
        DocumentId: this.evidence.documentId,
        DisputeId: this.evidence.disputeId,
        IssueIds: this.evidence.issueIds
      };
    } else {
      this.evidenceModel = {
        EvidenceId: uuid(),
        Text: '',
        PageNumber: null,
        DocumentId: null,
        DisputeId: null,
        IssueIds: null
      };
    }
  }
}
