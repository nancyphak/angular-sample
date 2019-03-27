export interface Issue {
  id?: string;
  name?: string;
  disputeId?: string;
  parentIssueId?: string;
  afterIssueId?: string;
  notes?: string;
  index?: number;
  level?: number;
  children?: Array<Issue>;
  notesHeightPreference?: number;
}

export interface ResponseIssueModel {
  id?: string;
  name?: string;
  notes?: string;
  notesHeightPreference?: number;
}

export interface UpdateIssueModel {
  id: string;
  disputeId: string;
  newName: string;
}

export interface IssueOrderingModel {
  disputeId: string;
  issueIds: string[];
}

export interface SetIssuePositionModel {
  disputeId: string;
  issueId: string;
  parentIssueId: string;
  afterIssueId?: string;
}

export interface SetIssueNotesHeightModel {
  disputeId: string;
  issueId: string;
  height: number;
}

