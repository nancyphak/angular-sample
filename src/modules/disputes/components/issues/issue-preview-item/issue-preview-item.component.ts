import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { appConfig } from '@app/config';
import { ConfirmDialog } from 'modules/shared';
import { Issue, Person, Pleading, IssueEvidence, DocumentModel } from '../../../models';
import * as fromStore from '../../../_store';
import { PromptDialog } from 'modules/shared';
import { IssuesEventService } from '../../../services';
import { DomSanitizer } from '@angular/platform-browser';

const PADDING = 12;

@Component({
  selector: 'issue-preview-item',
  templateUrl: './issue-preview-item.component.html',
  styleUrls: ['./issue-preview-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class IssuePreviewItemComponent implements OnInit, OnChanges {
  @Input() issue: Issue;
  @Input() children: Issue[];
  @Input() people: Person[];
  @Input() evidences: Array<IssueEvidence>;
  @Input() pleadings: Pleading[];
  @Input() documents: Array<DocumentModel>;

  @Output() addChildIssue: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() saveIssueName: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() setIssueNotes: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() saveChildIssueName: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() saveChildIssueNotes: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() removeIssue: EventEmitter<Issue> = new EventEmitter<Issue>();
  @Output() selectPerson: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() stopDragSplitView = new EventEmitter();

  @ViewChild('issueNameInput') issueNameInput;

  public heightNotes: number;
  public minHeightNotes: number;
  public bottomMinHeight: number;
  public targets: Array<Element>;
  public containerIssueDetails: Element;
  public issueDetailItemActive: string;

  constructor(private store: Store<fromStore.DisputeState>,
              private router: Router,
              private scrollToService: ScrollToService,
              private issueEvent: IssuesEventService,
              private dialog: MatDialog,
              private ref: ChangeDetectorRef,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('docs', sanitizer.bypassSecurityTrustResourceUrl('assets/images/issue-detail/docs_icon.svg'));
    iconRegistry.addSvgIcon('facts', sanitizer.bypassSecurityTrustResourceUrl('assets/images/issue-detail/facts_icon.svg'));
    iconRegistry.addSvgIcon('issues', sanitizer.bypassSecurityTrustResourceUrl('assets/images/issue-detail/issues_icon.svg'));
    iconRegistry.addSvgIcon('people', sanitizer.bypassSecurityTrustResourceUrl('assets/images/issue-detail/people_icon.svg'));
    iconRegistry.addSvgIcon('pleadings', sanitizer.bypassSecurityTrustResourceUrl('assets/images/issue-detail/pleadings_icon.svg'));

    this.issueEvent.onSelect.subscribe((issue: Issue) => {
      this.scrollToDetailItem('targetIssues');

      this.updateHeightNotes(issue);
    });
  }

  ngOnInit() {
    this.bottomMinHeight = appConfig.bottomMinHeightIssueDetail;
    this.minHeightNotes = appConfig.topMinHeightIssueNotes;

    this.updateHeightNotes(this.issue);

    this.containerIssueDetails = document.querySelector('#containerIssueDetails');

    this.targets = [
      document.querySelector('#targetIssues'),
      document.querySelector('#targetPleadings'),
      document.querySelector('#targetFacts'),
      document.querySelector('#targetPeople'),
      document.querySelector('#targetDocs')
    ];

    this.issueDetailItemActive = this.targets[0].id;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.issue) {
      this.updateHeightNotes(this.issue);
    }
  }

  onAddChildIssue() {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '350px',
      disableClose: true,
      data: {
        title: 'Add Sub-Issue',
        placeholder: 'Issue Name',
        okButtonText: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.text) {
        const issue: Issue = {
          id: uuid(),
          name: result.text,
          parentIssueId: this.issue.id,
          disputeId: this.issue.disputeId
        };
        this.addChildIssue.emit(issue);
      }
    });
  }

  onSaveIssueName(event) {
    const name = event.trim();
    const issue = _.cloneDeep(this.issue);
    issue.name = name;
    this.saveIssueName.emit(issue);
  }

  onSaveNotes(event) {
    const notes = event.trim();

    if (!notes) {
      this.heightNotes = appConfig.topMinHeightIssueNotes;
    }

    this.setIssueNotes.emit({
      ...this.issue,
      notes: notes
    });
  }

  onSaveChildIssueName(newName: string, issue: Issue) {
    const name = newName.trim();
    const clonedIssue = _.cloneDeep(issue);
    clonedIssue.name = name;
    this.saveChildIssueName.emit(clonedIssue);
  }

  onSaveChildIssueNotes(newNotes, issue: Issue) {
    const notes = newNotes.trim();

    this.saveChildIssueNotes.emit({
      ...issue,
      notes: notes
    });
  }

  onDeleteClicked() {
    this.openDeleteDialog();
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
          this.removeIssue.emit(this.issue);
          this.deleteChildren(this.children);
        }
      });
  }

  deleteChildren(arr: Array<any>) {
    if (!arr || arr.length <= 0) {
      return;
    }
    arr.forEach((item: any) => {
      const update = {
        id: item.id,
        disputeId: item.disputeId
      };
      this.removeIssue.emit(update);
      this.deleteChildren(item.children);
    });
  }

  onSelectDocument(ev) {
    this.router.navigate(['disputes', this.issue.disputeId, 'documents', ev.document.id, 'view', 'facts']);
  }

  onSelectPerson(person: Person) {
    this.selectPerson.emit(person);
    this.router.navigate(['disputes', this.issue.disputeId, 'issues', this.issue.id, 'people', person.id]);
  }

  onEditClicked() {
    this.issueNameInput.focus();
  }

  onInputIssueNotes() {
    if (this.issue.notesHeightPreference) {
      return;
    }

    const formFieldWrapperHeight = document.querySelector('.notes-field .form-field-wrapper').clientHeight;
    this.setHeightNotes(formFieldWrapperHeight);
  }

  initHeightNotes() {
    const initHeightInterval = setInterval(() => {
      const formFieldWrapperHeight = document.querySelector('.notes-field .form-field-wrapper').clientHeight;
      if (formFieldWrapperHeight) {
        this.setHeightNotes(formFieldWrapperHeight);

        clearInterval(initHeightInterval);
      }
    }, 100);
  }

  setHeightNotes(formFieldWrapperHeight: number) {
    const toolbarTitleIssue = document.querySelector('.toolbar-title-issue').clientHeight;

    this.heightNotes = Math.min(formFieldWrapperHeight + toolbarTitleIssue + 3 * PADDING, appConfig.maxHeightAutoIssueNotes);
    this.ref.detectChanges();
  }

  onStopDragSplitView(topHeight: number) {
    this.stopDragSplitView.emit({
      disputeId: this.issue.disputeId,
      issueId: this.issue.id,
      height: topHeight,
    });

    this.heightNotes = topHeight;
  }

  onScrollIssueDetail() {
    const targets = this.targets.filter((target) => {
      return target.getBoundingClientRect().top <= this.containerIssueDetails.getBoundingClientRect().top + 5;
    });
    if (targets.length) {
      this.issueDetailItemActive = targets[targets.length - 1].id;
    } else {
      this.issueDetailItemActive = this.targets[0].id;
    }
  }

  scrollToDetailItem(target: string) {
    const config: ScrollToConfigOptions = {
      container: 'containerIssueDetails',
      duration: 100,
      target: target
    };
    this.scrollToService.scrollTo(config);

    setTimeout(() => {
      this.issueDetailItemActive = target;
      this.ref.detectChanges();
    }, 150);
  }

  updateHeightNotes(issue: Issue) {
    if (issue.notesHeightPreference) {
      this.heightNotes = issue.notesHeightPreference;
    } else if (!issue.notes) {
      this.heightNotes = appConfig.topMinHeightIssueNotes;
    } else {
      this.initHeightNotes();
    }
  }
}
