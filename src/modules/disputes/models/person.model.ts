import { Evidence } from './evidence.model';

export interface Person {
  id?: string;
  name?: string;
  disputeId?: string;
  documentIds?: Array<any>;
  selected?: boolean;
  index?: number;
}

export interface DeletePersonModel {
  disputeId: string;
  personId: string;
}

export interface RenamePersonModel {
  disputeId: string;
  personId: string;
  newName: string;
}

export interface SetDocumentPeopleModel {
  disputeId: string;
  documentId: string;
  peopleIds?: Array<string>;
}

export interface DocumentViewModel {
  id: string;
  name: string;
  evidences: Array<Evidence>;
}

export interface PersonDetailViewModel {
  id?: string;
  name?: string;
  disputeId?: string;
  documentIds?: Array<string>;
  documents: Array<DocumentViewModel>;
}
