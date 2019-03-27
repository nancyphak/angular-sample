import { Issue } from './issue.model';
import { Pleading } from './pleading.model';
import { Person } from './person.model';
import { DocumentModel } from './document.model';

export interface IssueDetailModel {
    id: string;
    entity: Issue;
    children: Array<Issue>;
    evidences: Array<IssueEvidence>;
    pleadings: Array<Pleading>;
    people: Array<Person>;
    documents: Array<DocumentModel>;
}

export interface IssueEvidenceItem {
    id: string;
    text: string;
    pageNumber: number;
    documentId: string;
    disputeId: string;
}

export interface IssueEvidence {
    evidenceItems: Array<IssueEvidenceItem>;
    document: DocumentModel;
}
