import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as fromChronologies from '../actions/chronologies.action';
import * as actionTypes from '../actions/chronology-action-type';
import { Error } from '../../../app/_store';
import { Chronology } from '../../models';

export interface State extends EntityState<Chronology> {
  disputeIdOfEntries: string;
  loaded: boolean;
  loading: boolean;
  error: Error;
}

export const adapter: EntityAdapter<Chronology> = createEntityAdapter<Chronology>();

export const initialState: State = adapter.getInitialState({
  disputeIdOfEntries: '',
  loading: false,
  loaded: false,
  error: null
});

export const errorMessage = 'Sorry, some thing is wrong...';

export function reducer(state = initialState, action: fromChronologies.ChronologiesAction): State {
  switch (action.type) {
    case actionTypes.LOAD_CHRONOLOGIES: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case actionTypes.LOAD_CHRONOLOGIES_SUCCESS: {
      return adapter.upsertMany(action.payload.chronologies, {
        ...state,
        disputeIdOfEntries: action.payload.disputeIdOfEntries,
        loaded: true,
        loading: false,
        error: null
      });
    }

    case actionTypes.LOAD_CHRONOLOGIES_FAIL: {
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

    case actionTypes.CREATE_CHRONOLOGY: {
      const chronology: Chronology = {
        ...action.payload
      };
      return adapter.addOne(chronology, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.CREATE_CHRONOLOGY_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.CREATE_CHRONOLOGY_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_CHRONOLOGY: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.REMOVE_CHRONOLOGY_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.REMOVE_CHRONOLOGY_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.UPDATE_CHRONOLOGY: {
      const event = action.payload;
      return adapter.updateOne({id: event.id, changes: event}, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.UPDATE_CHRONOLOGY_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.UPDATE_CHRONOLOGY_FAIL: {
      return {
        ...state,
        loading: false,
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

export const getChronologiesLoading = (state: State) => state.loading;
export const getChronologiesLoaded = (state: State) => state.loaded;
export const getError = (state: State) => state.error;
export const getDisputeIdOfEntries = (state: State) => state.disputeIdOfEntries;
