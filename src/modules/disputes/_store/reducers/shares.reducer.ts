import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Error } from 'modules/app/_store';
import { ShareDisputeModel } from '../../models';
import * as fromShares from '../actions/shares.action';
import * as actionTypes from '../actions/share-action-type';
import * as _ from 'lodash';

export interface State extends EntityState<ShareDisputeModel> {
  selectedInviteId: string | null;
  loaded: boolean;
  loading: boolean;
  error: Error;
}

export function sortByIndex(a: ShareDisputeModel, b: ShareDisputeModel): number {
  return a.index - b.index;
}

export const adapter: EntityAdapter<ShareDisputeModel> = createEntityAdapter<ShareDisputeModel>({
  sortComparer: sortByIndex
});

export const initialState = adapter.getInitialState({
  selectedInviteId: null,
  loaded: false,
  loading: false,
  error: null
});

export const errorMessage = 'Sorry, some thing is wrong...';

export function reducer(state = initialState, action: fromShares.SharesAction): State {
  switch (action.type) {
    case actionTypes.LOAD_SHARES: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case actionTypes.LOAD_SHARES_SUCCESS: {
      const shares = _.cloneDeep(action.payload);
      shares.forEach((share: ShareDisputeModel, index: number) => share.index = index);
      return adapter.upsertMany(shares, {
        ...state,
        loaded: true,
        loading: false,
        error: null
      });
    }

    case actionTypes.LOAD_SHARES_FAIL: {
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

    case actionTypes.CREATE_SHARE: {
      return adapter.addOne(action.payload, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.CREATE_SHARE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.CREATE_SHARE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_SHARE: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.REMOVE_SHARE_SUCCESS: {
      return adapter.removeOne(action.payload.id, {
        ...state,
        loading: false,
        error: null
      });
    }

    case actionTypes.REMOVE_SHARE_FAIL: {
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

export const getSharesLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
export const getSelectedInviteId = (state: State) => state.selectedInviteId;

