import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EvidencesPageModel, Issue } from '../../../models';

@Component({
  selector: 'evidence-view',
  templateUrl: './evidence-view.component.html',
  styleUrls: ['./evidence-view.component.scss']
})
export class EvidenceViewComponent {

  @Input() evidence: EvidencesPageModel;
  @Input() issueIds: Array<any>;

  @Output() deleteEvidence = new EventEmitter();
  @Output() updateEvidence = new EventEmitter();
  @Output() selectPerson = new EventEmitter();
  @Output() selectIssue = new EventEmitter();

  onDeleteEvidence() {
    this.deleteEvidence.emit(this.evidence);
  }

  removeIssue(issue: Issue) {
    this.updateEvidence.emit({
      ...this.evidence,
      issueIds: this.evidence.issueIds.filter(id => id !== issue.id)
    });
  }

  onSelectIssue(issue: Issue) {
    this.selectIssue.emit(issue);
  }

  onSelectPerson(person) {
    this.selectPerson.emit(person);
  }

}
