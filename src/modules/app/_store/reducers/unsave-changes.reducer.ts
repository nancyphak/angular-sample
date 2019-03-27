import * as fromActions from '../actions/unsave-changes.action';

export interface State {
  unSavedChanges: boolean;
  showingConfirm: boolean;
}

export const initialState: State = {
  unSavedChanges: false,
  showingConfirm: false
};

export function reducer(state = initialState, action: fromActions.UnSaveChangesAction): State {
  switch (action.type) {

    case fromActions.SHOWING_CONFIRM: {
      return {
        ...state,
        showingConfirm: true
      };
    }

    case fromActions.CLOSING_CONFIRM: {
      return {
        ...state,
        showingConfirm: false
      };
    }

    case fromActions.SAVED_CHANGES: {
      return {
        ...state,
        unSavedChanges: false
      };
    }

    case fromActions.UNSAVED_CHANGES: {
      return {
        ...state,
        unSavedChanges: true
      };
    }

    case fromActions.DISCARD_CHANGES: {
      return {
        ...state,
        unSavedChanges: false
      };
    }

    default: {
      return state;
    }
  }
}

export const getUnSavedChanges = (state: State) => state.unSavedChanges;
export const getShowingConfirm = (state: State) => state.showingConfirm;
