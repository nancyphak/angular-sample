import { Action } from '@ngrx/store';

import * as actionTypes from './document-action-type';
import { DocumentMetadata, DocumentModel } from '../../models';

export class SelectDocument implements Action {
  readonly type = actionTypes.SELECT_DOCUMENT;

  constructor(public payload: { id: string }) {
  }
}

export class UserLeftDocumentViewPage implements Action {
  readonly type = actionTypes.USER_LEFT_DOCUMENT_VIEW_PAGE;

  constructor(public payload?: DocumentModel) {
  }
}

export class UserLeftDocumentPage implements Action {
  readonly type = actionTypes.USER_LEFT_DOCUMENT_PAGE;
}

export class GetDocumentMetadataByDispute implements Action {
  readonly type = actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE;

  constructor(public payload: { disputeId: string }) {
  }
}

export class GetDocumentMetadataByDisputeSilent implements Action {
  readonly type = actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE_SILENT;

  constructor(public payload: { disputeId: string }) {
  }
}

export class GetDocumentMetadataByDisputeSuccess implements Action {
  readonly type = actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE_SUCCESS;

  constructor(public payload: { disputeIdOfDocumentMetadataEntries: string, documentMetadata: Array<DocumentMetadata> }) {
  }
}

export class GetDocumentMetadataByDisputeFail implements Action {
  readonly type = actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE_FAIL;

  constructor(public payload?: any) {
  }
}

export class SetDocumentMetadata implements Action {
  readonly type = actionTypes.SET_DOCUMENT_METADATA;

  constructor(public payload: DocumentMetadata) {
  }
}

export class SetDocumentMetadataSuccess implements Action {
  readonly type = actionTypes.SET_DOCUMENT_METADATA_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class SetDocumentMetadataFail implements Action {
  readonly type = actionTypes.SET_DOCUMENT_METADATA_FAIL;

  constructor(public payload?: any) {
  }
}

export class GetDocumentsByDispute implements Action {
  readonly type = actionTypes.GET_DOCUMENTS_BY_DISPUTE;

  constructor(public payload: { disputeId: string }) {
  }
}

export class GetDocumentsByDisputeSilent implements Action {
  readonly type = actionTypes.GET_DOCUMENTS_BY_DISPUTE_SILENT;

  constructor(public payload: { disputeId: string }) {
  }
}

export class GetDocumentsByDisputeSuccess implements Action {
  readonly type = actionTypes.GET_DOCUMENTS_BY_DISPUTE_SUCCESS;

  constructor(public payload: { documents: DocumentModel[], disputeIdOfDocumentEntries: string }) {
  }
}

export class GetDocumentsByDisputeFail implements Action {
  readonly type = actionTypes.GET_DOCUMENTS_BY_DISPUTE_FAIL;

  constructor(public payload?: any) {
  }
}

export class SetDocumentDescription implements Action {
  readonly type = actionTypes.SET_DOCUMENT_DESCRIPTION;

  constructor(public payload: DocumentModel) {
  }
}

export class SetDocumentDescriptionSuccess implements Action {
  readonly type = actionTypes.SET_DOCUMENT_DESCRIPTION_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class SetDocumentDescriptionFail implements Action {
  readonly type = actionTypes.SET_DOCUMENT_DESCRIPTION_FAIL;

  constructor(public payload?: any) {
  }
}

export class DeleteDocument implements Action {
  readonly type = actionTypes.DELETE_DOCUMENT;

  constructor(public payload: DocumentModel) {
  }
}

export class DeleteDocumentSuccess implements Action {
  readonly type = actionTypes.DELETE_DOCUMENT_SUCCESS;

  constructor(public payload: DocumentModel) {
  }
}

export class DeleteDocumentFail implements Action {
  readonly type = actionTypes.DELETE_DOCUMENT_FAIL;

  constructor(public payload?: any) {
  }
}

export class ChangeCurrentPageNumber implements Action {
  readonly type = actionTypes.CHANGE_CURRENT_PAGE_NUMBER;

  constructor(public payload: number) {
  }
}

export type DocumentActions =
  | SelectDocument | UserLeftDocumentViewPage | UserLeftDocumentPage
  | SetDocumentMetadata | SetDocumentMetadataSuccess | SetDocumentMetadataFail
  | GetDocumentMetadataByDispute | GetDocumentMetadataByDisputeSuccess
  | GetDocumentMetadataByDisputeFail | GetDocumentMetadataByDisputeSilent
  | GetDocumentsByDispute | GetDocumentsByDisputeSuccess
  | GetDocumentsByDisputeFail | GetDocumentsByDisputeSilent
  | SetDocumentDescription | SetDocumentDescriptionSuccess | SetDocumentDescriptionFail
  | DeleteDocument | DeleteDocumentSuccess | DeleteDocumentFail
  | ChangeCurrentPageNumber ;
