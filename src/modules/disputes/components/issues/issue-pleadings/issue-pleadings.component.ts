import { Component, OnInit, Input } from '@angular/core';
import { Pleading, Issue } from '../../../models';

@Component({
  selector: 'issue-pleadings',
  templateUrl: './issue-pleadings.component.html',
  styleUrls: ['./issue-pleadings.component.scss']
})
export class IssuePleadingsComponent {
  @Input() issue: Issue;
  @Input() pleadings: Pleading[];
}
