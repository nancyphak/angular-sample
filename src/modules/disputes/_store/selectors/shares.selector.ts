import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromShares from '../reducers/shares.reducer';
import { selectCurrentDisputeId } from './disputes.selector';

export const selectSharesState = createSelector(
  fromFeature.getDisputeState,
  (state: fromFeature.DisputeState) => state.shares);

export const {
  selectEntities: selectShareEntities,
  selectAll: selectAllShares
} = fromShares.adapter.getSelectors(selectSharesState);

export const selectSharesByDisputeId = createSelector(
  selectAllShares,
  selectCurrentDisputeId,
  (shares, disputeId) => {
    return shares.filter((share) => {
      return share.disputeId && share.disputeId.toString() === disputeId;
    });
  }
);

export const checkISharesExistedForSelectedDispute = createSelector(
  selectAllShares,
  selectCurrentDisputeId,
  (shares, disputeId) => {
    return shares.some((share) => {
      return share.disputeId && share.disputeId.toString() === disputeId;
    });
  }
);

export const selectCurrentInviteId = createSelector(selectSharesState, fromShares.getSelectedInviteId);

export const selectSharesLoading = createSelector(
  selectSharesState,
  fromShares.getSharesLoading
);

export const selectShareError = createSelector(
  selectSharesState,
  fromShares.getError
);
