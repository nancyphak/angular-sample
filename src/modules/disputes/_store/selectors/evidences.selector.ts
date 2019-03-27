import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromEvidence from '../reducers/evidences.reducer';
import { selectCurrentDocument } from './documents.selector';
import { selectIssuesByDisputeId } from './issues.selector';
import { selectCurrentDisputeId } from './disputes.selector';
import { Evidence } from '../../models';

export const selectEvidencesState = createSelector(
  fromFeature.getDisputeState,
  (state: fromFeature.DisputeState) => state.evidences);

export const {
  selectAll: selectAllEvidence,
} = fromEvidence.adapter.getSelectors(selectEvidencesState);

export const selectEvidenceForDocument = createSelector(
  selectAllEvidence,
  selectIssuesByDisputeId,
  selectCurrentDisputeId,
  selectCurrentDocument,
  (evidences: Array<any>, issues: Array<any>, disputeId, document) => {
    const results = [];
    const listEvidences = evidences.filter((evidence: Evidence) => {
      return (evidence.disputeId && evidence.disputeId.toString() === disputeId) &&
        (document && document.id === evidence.documentId);
    });

    listEvidences.forEach((evidence: Evidence) => {
      if (!evidence.issueIds || evidence.issueIds.length < 0 || issues.length < 0) {
        return;
      }
      const newEvidence = {
        ...evidence,
        issues: []
      };
      evidence.issueIds.forEach((id) => {
        issues.forEach(issue => {
          if (issue.id === id) {
            newEvidence.issues.push(issue);
          }
        });
      });

      results.push(newEvidence);
    });

    return results;

  }
);

export const selectEvidencesForDispute = createSelector(
  selectAllEvidence,
  selectIssuesByDisputeId,
  selectCurrentDisputeId,
  (evidences: Array<any>, issues: Array<any>, disputeId) => {
    const results = [];
    const listEvidences = evidences.filter((evidence: Evidence) => {
      return (evidence.disputeId && evidence.disputeId.toString() === disputeId);
    });

    listEvidences.forEach((evidence: Evidence) => {
      if (!evidence.issueIds || evidence.issueIds.length < 0 || issues.length < 0) {
        return;
      }
      const newEvidence = {
        ...evidence,
        issues: []
      };
      evidence.issueIds.forEach((id) => {
        issues.forEach(issue => {
          if (issue.id === id) {
            newEvidence.issues.push(issue);
          }
        });
      });

      results.push(newEvidence);
    });

    return results;

  }
);

export const selectEvidenceLoading = createSelector(
  selectEvidencesState,
  fromEvidence.getLoading
);

export const selectEvidenceLoaded = createSelector(
  selectEvidencesState,
  fromEvidence.getLoaded
);

export const selectEvidencesError = createSelector(
  selectEvidencesState,
  fromEvidence.getError
);

export const selectDisputeIdOfEvidenceEntries = createSelector(
  selectEvidencesState,
  fromEvidence.getDisputeIdOfEvidenceEntries
);

export const checkIfEvidenceExistedForSelectedDispute = createSelector(
  selectAllEvidence,
  selectCurrentDisputeId,
  (evidences, currentDisputeId) => {
    return evidences.some((evidence) => {
      return evidence.disputeId && evidence.disputeId === currentDisputeId;
    });
  }
);

export const selectEvidencesIsDragging = createSelector(
  selectEvidencesState,
  fromEvidence.getIsDragging
);

