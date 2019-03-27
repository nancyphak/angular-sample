import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromIssues from '../reducers/issues.reducer';
import { selectCurrentDisputeId } from './disputes.selector';
import { selectActivatedRoute } from 'modules/app/_store';

export const selectIssuesState = createSelector(
  fromFeature.getDisputeState,
  (state: fromFeature.DisputeState) => state.issues);

export const {
  selectEntities: selectIssueEntities,
  selectAll: selectAllIssues,
  selectIds: selectIssueIds
} = fromIssues.adapter.getSelectors(selectIssuesState);

export const selectIssuesByDisputeId = createSelector(
  selectAllIssues,
  selectCurrentDisputeId,
  (issues, disputeId) => {
    return issues.filter((issue) => {
      return issue.disputeId && issue.disputeId.toString() === disputeId;
    });
  }
);

export const checkIfIssuesExistedForSelectedDispute = createSelector(
  selectAllIssues,
  selectCurrentDisputeId,
  (issues, disputeId) => {
    return issues.some((issue) => {
      return issue.disputeId && issue.disputeId.toString() === disputeId;
    });
  }
);

export const selectIssuesLoading = createSelector(
  selectIssuesState,
  fromIssues.getIssuesLoading
);

export const selectIssuesLoaded = createSelector(
  selectIssuesState,
  fromIssues.getIssuesLoaded
);

export const selectIssueError = createSelector(
  selectIssuesState,
  fromIssues.getError
);

export const selectIssueIssueIds = createSelector(
  selectIssuesState,
  fromIssues.getIssueIds
);

export const selectDraggingIssue = createSelector(
  selectIssuesState,
  fromIssues.getDraggingIssue
);

export const selectToIssueId = createSelector(
  selectIssuesState,
  fromIssues.getSelectedId
);

export const selectDisputeIdOfIssuesEntries = createSelector(
  selectIssuesState,
  fromIssues.getDisputeIdOfIssuesEntries,
);

export const selectCurrentIssue = createSelector(
  selectIssueEntities,
  selectActivatedRoute,
  (entities, route) => {
    return entities[route.params.issueId];
  }
);
