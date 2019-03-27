import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import * as fromUnSavedChanges from './unsave-changes.reducer';
import { environment } from '@app/env';
import { logger, cypress } from '../meta-reducers';

export { undoReducer } from './undo.reducer';

import * as fromRouter from './router.reducer';

export interface AppState {
  routerReducer: fromRouter.State;
  unSavedChanges: fromUnSavedChanges.State;
}

export const reducers: ActionReducerMap<AppState> = {
  routerReducer: fromRouter.reducer,
  unSavedChanges: fromUnSavedChanges.reducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger, storeFreeze, cypress]
  : [];

export const getUnSavedChangesState = createFeatureSelector<fromUnSavedChanges.State>('unSavedChanges');

export const selectUnSavedChanges = createSelector(
  getUnSavedChangesState,
  fromUnSavedChanges.getUnSavedChanges
);

export const selectShowingConfirm = createSelector(
  getUnSavedChangesState,
  fromUnSavedChanges.getShowingConfirm
);

export const getRouterState = createFeatureSelector<fromRouter.State>('routerReducer');

export const selectActivatedRoute = createSelector(getRouterState, fromRouter.getActivatedRoute);
export const selectRouterState = createSelector(getRouterState, fromRouter.getRouterState);
