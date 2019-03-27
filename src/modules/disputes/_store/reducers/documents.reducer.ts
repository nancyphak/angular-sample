import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as _ from 'lodash';
import * as fromActions from '../actions/documents.action';
import * as actionTypes from '../actions/document-action-type';
import * as actionsUpload from '../actions/upload-file.action';
import { DocumentMetadata, DocumentModel } from '../../models';
import { Error } from '../../../app/_store';

export interface State extends EntityState<DocumentModel> {
  disputeIdOfDocumentEntries: string;
  disputeIdOfDocumentMetadataEntries: string;
  selectedDocumentId: string;
  documentMetadata: Array<DocumentMetadata>;
  loaded: boolean;
  loading: boolean;
  haveLoad: boolean;
  documentsLoading: boolean;
  documentMetadataVisible: boolean;
  error: Error;
  currentPageNumber: number;
}

export const adapter: EntityAdapter<DocumentModel> = createEntityAdapter<DocumentModel>();

export const initialState: State = adapter.getInitialState({
  folderEntriesLoaded: false,
  disputeIdOfDocumentEntries: 'NONE_LOADED',
  disputeIdOfDocumentMetadataEntries: 'NONE_LOADED',
  selectedDocumentId: null,
  documentMetadata: [],
  loaded: false,
  haveLoad: false,
  loading: false,
  documentsLoading: false,
  documentMetadataVisible: false,
  error: null,
  currentPageNumber: null
});

export const errorMessage = 'Sorry, some thing is wrong...';

export function reducer(state = initialState, action: fromActions.DocumentActions | actionsUpload.Actions): State {
  switch (action.type) {

    case actionTypes.SELECT_DOCUMENT: {
      if (action.payload.id === state.selectedDocumentId) {
        return {
          ...state,
          selectedDocumentId: null,
          documentMetadataVisible: false
        };
      }
      return {
        ...state,
        selectedDocumentId: action.payload.id,
        documentMetadataVisible: true
      };
    }

    case actionTypes.USER_LEFT_DOCUMENT_VIEW_PAGE: {
      return {
        ...state,
        selectedDocumentId: null
      };
    }

    case actionTypes.USER_LEFT_DOCUMENT_PAGE: {
      return {
        ...state,
        selectedDocumentId: null,
        documentMetadataVisible: false
      };
    }

    case actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE: {
      return {
        ...state,
        loading: true
      };
    }

    case actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE_SUCCESS: {
      return {
        ...state,
        loading: false,
        documentMetadata: action.payload.documentMetadata,
        disputeIdOfDocumentMetadataEntries: action.payload.disputeIdOfDocumentMetadataEntries
      };
    }

    case actionTypes.GET_DOCUMENT_METADATA_BY_DISPUTE_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.SET_DOCUMENT_METADATA: {
      const metadata = action.payload;
      const documentMetadata = _.cloneDeep(state.documentMetadata);
      let isExist = false;
      for (let i = 0; i < documentMetadata.length; i++) {
        if (documentMetadata[i].documentId === metadata.documentId) {
          documentMetadata[i] = metadata;
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        documentMetadata.push(metadata);
      }
      return {
        ...state,
        loading: true,
        documentMetadata
      };
    }

    case actionTypes.SET_DOCUMENT_METADATA_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }

    case actionTypes.SET_DOCUMENT_METADATA_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.GET_DOCUMENTS_BY_DISPUTE: {
      return {
        ...state,
        loading: true,
        haveLoad: true,
        documentsLoading: true
      };
    }

    case actionTypes.GET_DOCUMENTS_BY_DISPUTE_SUCCESS: {
      return adapter.upsertMany(action.payload.documents, {
        ...state,
        loading: false,
        disputeIdOfDocumentEntries: action.payload.disputeIdOfDocumentEntries,
        documentsLoading: false
      });
    }

    case actionTypes.GET_DOCUMENTS_BY_DISPUTE_FAIL: {
      return {
        ...state,
        documentsLoading: false,
        loaded: false,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.SET_DOCUMENT_DESCRIPTION: {
      const selectedDocument = _.cloneDeep(state.entities[action.payload.id]);
      selectedDocument.description = action.payload.description;

      return adapter.updateOne({id: selectedDocument.id, changes: selectedDocument}, {
        ...state,
        loading: true
      });
    }

    case actionTypes.SET_DOCUMENT_DESCRIPTION_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }

    case actionTypes.SET_DOCUMENT_DESCRIPTION_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.DELETE_DOCUMENT: {
      const documentMetadataVisible = !!state.selectedDocumentId && state.selectedDocumentId !== action.payload.id;
      return adapter.removeOne(action.payload.id, {
        ...state,
        documentMetadataVisible,
        loading: true
      });
    }

    case actionTypes.DELETE_DOCUMENT_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }

    case actionTypes.DELETE_DOCUMENT_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.CHANGE_CURRENT_PAGE_NUMBER: {
      return {
        ...state,
        currentPageNumber: action.payload
      };
    }

    case actionsUpload.UPLOAD_COMPLETE_DELAY: {
      if (state.selectedDocumentId) {
        return {
          ...state,
          documentMetadataVisible: true
        };
      }
      return state;
    }

    case actionsUpload.UPLOAD_SESSION_STARTED: {
      if (state.selectedDocumentId) {
        return {
          ...state,
          documentMetadataVisible: false
        };
      }
      return state;
    }

    default: {
      return state;
    }
  }
}

export const getDocumentLoading = (state: State) => state.loading;
export const getDocumentsLoading = (state: State) => state.documentsLoading;
export const getHaveLoad = (state: State) => state.haveLoad;
export const getDocumentError = (state: State) => state.error;
export const getCurrentDocumentId = (state: State) => state.selectedDocumentId;
export const getListDocumentMetadata = (state: State) => state.documentMetadata;
export const getDisputeIdOfDocumentEntries = (state: State) => state.disputeIdOfDocumentEntries;
export const getDisputeIdOfDocumentMetadataEntries = (state: State) => state.disputeIdOfDocumentMetadataEntries;
export const getDocumentCurrentPageNumber = (state: State) => state.currentPageNumber;
export const getDocumentMetadataVisible = (state: State) => state.documentMetadataVisible;
