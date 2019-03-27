import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Evidence } from '../../models';
import * as _ from 'lodash';
import * as documentActionTypes from '../actions/document-action-type';
import * as fromDocumentActions from '../actions/documents.action';
import * as fromActions from '../actions/evidences.action';
import * as actionTypes from '../actions/evidence-action-type';
import { Error } from 'modules/app/_store';

export interface State extends EntityState<Evidence> {
  disputeIdOfEvidenceEntries: string;
  loading: boolean;
  loaded: boolean;
  error: Error;
  draggingEvidence: boolean;
}

export function sortByIndex(a: Evidence, b: Evidence): number {
  return a.index - b.index;
}

export const adapter: EntityAdapter<Evidence> = createEntityAdapter<Evidence>({
  sortComparer: sortByIndex
});

export const initialState: State = adapter.getInitialState({
  disputeIdOfEvidenceEntries: '',
  loading: false,
  loaded: false,
  error: null,
  draggingEvidence: false
});

export const errorMessage = 'Sorry, some thing is wrong...';

export function reducer(state = initialState,
                        action: fromActions.EvidencesAction | fromDocumentActions.DocumentActions): State {
  switch (action.type) {
    case actionTypes.GET_EVIDENCES_BY_DISPUTE: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case actionTypes.GET_EVIDENCES_BY_DISPUTE_SUCCESS: {
      const evidences = _.cloneDeep(action.payload.evidences);
      evidences.forEach((evidence: Evidence, index: number) => evidence.index = index);
      return adapter.upsertMany(evidences, {
        ...state,
        disputeIdOfEvidenceEntries: action.payload.disputeIdOfEvidenceEntries,
        loading: false,
        loaded: true,
        error: null
      });
    }

    case actionTypes.GET_EVIDENCES_BY_DISPUTE_FAIL: {
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

    case actionTypes.CREATE_EVIDENCE: {
      const evidence: Evidence = {
          id: action.payload.EvidenceId,
          text: action.payload.Text.trim(),
          issueIds: action.payload.IssueIds,
          pageNumber: action.payload.PageNumber,
          documentId: action.payload.DocumentId,
          disputeId: action.payload.DisputeId,
          index: 0
        }
      ;
      return adapter.addOne(evidence, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.CREATE_EVIDENCE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.CREATE_EVIDENCE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.UPDATE_EVIDENCE: {
      const update = {
        id: action.payload.id,
        changes: {
          ...action.payload,
          text: action.payload.text.trim()
        }
      };
      return adapter.updateOne(update, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.UPDATE_EVIDENCE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.UPDATE_EVIDENCE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.DELETE_EVIDENCE: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.DELETE_EVIDENCE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.DELETE_EVIDENCE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case documentActionTypes.DELETE_DOCUMENT_SUCCESS: {
      const evidenceIds = [];
      for (const evidenceId in state.entities) {
        if (state.entities[evidenceId].documentId === action.payload.id) {
          evidenceIds.push(evidenceId);
        }
      }
      return adapter.removeMany(evidenceIds, {
        ...state,
        loading: false
      });
    }

    case actionTypes.EVIDENCE_DRAG_STARTED: {
      return {
        ...state,
        draggingEvidence: true
      };
    }

    case actionTypes.EVIDENCE_DROPPED: {
      return {
        ...state,
        draggingEvidence: false
      };
    }

    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoaded = (state: State) => state.loaded;
export const getError = (state: State) => state.error;
export const getDisputeIdOfEvidenceEntries = (state: State) => state.disputeIdOfEvidenceEntries;
export const getIsDragging = (state: State) => state.draggingEvidence;
