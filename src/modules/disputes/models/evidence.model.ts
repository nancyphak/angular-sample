import { DocumentModel } from './document.model';
import { Person } from './person.model';

export interface Evidence {
  evidenceId?: string;
  id?: string;
  text?: string;
  pageNumber: number;
  documentId: string;
  issueIds: Array<string>;
  issues?: Array<any>;
  disputeId?: string;
  index?: number;
}

export interface CreateEvidenceModel {
  EvidenceId: string;
  Text: string;
  PageNumber?: number;
  DocumentId?: string;
  IssueIds: Array<string>;
  DisputeId: string;
}

export interface EvidencesPageModel {
  id?: string;
  text?: string;
  pageNumber: number;
  documentId: string;
  document?: DocumentModel;
  issueIds: Array<string>;
  issues?: Array<any>;
  disputeId?: string;
  index?: number;
  people?: Array<Person>;
}

export interface DisputeBrowserEvidenceModel {
  id?: string;
  text?: string;
  pageNumber: number;
  documentId: string;
  document?: DocumentModel;
  issueIds: Array<string>;
  issues?: Array<any>;
  disputeId?: string;
  index?: number;
  people?: Array<Person>;
}
