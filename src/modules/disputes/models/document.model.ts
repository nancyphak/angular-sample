export interface DocumentTypeModel {
  id: string;
  name: string;
}

export interface DocumentMetadata {
  disputeId?: string;
  documentId?: string;
  typeId?: string;
  date?: any;
  dateDiscovery?: any;
  notes?: string;
  peopleId?: string;
}

export interface DocumentModel {
  id: string;
  name: string;
  description?: string;
  extension?: string;
  disputeId?: string;
  documentType?: string;
}

export interface DocumentMetadataResponse {
  documentId: string;
  typeId: string;
  date: string;
  dateDiscovery: string;
  notes: string;
}

export interface DeleteDocumentModel {
  documentId: string;
  disputeId: string;
}

export interface RenameDocumentModel {
  documentId: string;
  disputeId: string;
  newName: string;
}

