import { Issue, Pleading } from '../../models';

export interface IssueEvidenceItem {
  evidenceId: string;
  evidenceText: string;
  evidencePage: number;
}

export interface IssueEvidence {
  evidenceItems: IssueEvidenceItem[];
  documentName: string;
  documentId: string;
}

export interface IssueItem {
  id: string;
  name: string;
  children?: Array<Issue>;
  entity: Issue;
  evidence: IssueEvidence[];
  pleadings: Pleading[];
  people?: any;
}
