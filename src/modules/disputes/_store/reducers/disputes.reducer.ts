import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Error } from 'modules/app/_store';
import { Dispute } from '../../models';
import * as fromDisputes from '../actions/disputes.action';
import * as actionTypes from '../actions/dispute-action-type';

export interface State extends EntityState<Dispute> {
  selectedDisputeId: string | null;
  loaded: boolean;
  loading: boolean;
  error: Error;
}

export function sortByCreatedDate(a: Dispute, b: Dispute): number {
  const timeDiff = new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime();

  return timeDiff > 0 ? -1 : timeDiff < 0 ? 1 : 0;
}

export const adapter: EntityAdapter<Dispute> = createEntityAdapter<Dispute>({
  sortComparer: sortByCreatedDate
});

export const initialState = adapter.getInitialState({
  loaded: false,
  loading: false,
  selectedDisputeId: null,
  error: null
});

const errorMessage = 'Sorry, some thing is wrong...';

export function reducer(state = initialState, action: fromDisputes.DisputesAction): State {
  switch (action.type) {
    case actionTypes.LOAD_DISPUTES: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case actionTypes.LOAD_DISPUTES_SUCCESS: {
      return adapter.upsertMany(action.payload.disputes, {
        ...state,
        loaded: true,
        loading: false,
        error: null
      });
    }

    case actionTypes.LOAD_DISPUTES_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.SELECT_DISPUTE: {
      return {
        ...state,
        selectedDisputeId: action.payload
      };
    }

    case actionTypes.CREATE_DISPUTE: {
      return adapter.addOne(
        {
          ...action.payload,
          role: 'owner'
        },
        {
          ...state,
          error: null
        });
    }

    case actionTypes.CREATE_DISPUTE_SUCCESS: {
      return {
        ...state,
        error: null
      };
    }

    case actionTypes.CREATE_DISPUTE_FAIL: {
      return {
        ...state,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.UPDATE_DISPUTE: {
      return adapter.updateOne({id: action.payload.id, changes: action.payload}, state);
    }

    case actionTypes.UPDATE_DISPUTE_SUCCESS: {
      return {
        ...state,
        error: null
      };
    }

    case actionTypes.UPDATE_DISPUTE_FAIL: {
      return {
        ...state,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_DISPUTE: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        error: null
      });
    }

    case actionTypes.REMOVE_DISPUTE_FAIL: {
      return {
        ...state,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    default: {
      return state;
    }
  }
}

export const getDisputesLoading = (state: State) => state.loading;
export const getDisputesLoaded = (state: State) => state.loaded;
export const getSelectedDisputeId = (state: State) => state.selectedDisputeId;
export const getError = (state: State) => state.error;

