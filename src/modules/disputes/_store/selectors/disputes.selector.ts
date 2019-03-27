import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromDisputes from '../reducers/disputes.reducer';
import { selectActivatedRoute } from 'modules/app/_store/reducers';

export const selectDisputesState = createSelector(
  fromFeature.getAccountState,
  (state: fromFeature.AccountState) => state.disputes);

export const {
  selectEntities: selectDisputeEntities,
  selectAll: selectAllDisputes,
  selectTotal: selectTotalDisputes
} = fromDisputes.adapter.getSelectors(selectDisputesState);

export const selectCurrentDisputeId = createSelector(selectDisputesState, fromDisputes.getSelectedDisputeId);

export const selectCurrentDispute = createSelector(
  selectDisputeEntities,
  selectActivatedRoute,
  selectCurrentDisputeId,
  (disputeEntities, route, currentDisputeId) => {
    if (route) {
      return disputeEntities[route.params.disputeId];
    }
    return disputeEntities[currentDisputeId];
  }
);

export const checkIfTheDisputesIsEmpty = createSelector(
  selectTotalDisputes,
  (total) => total === 0
);

export const selectDisputesLoading = createSelector(
  selectDisputesState,
  fromDisputes.getDisputesLoading
);

export const selectDisputesLoaded = createSelector(
  selectDisputesState,
  fromDisputes.getDisputesLoaded
);

export const selectDisputeError = createSelector(
  selectDisputesState,
  fromDisputes.getError
);
