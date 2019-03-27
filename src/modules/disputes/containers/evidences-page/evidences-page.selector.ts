import { createSelector } from '@ngrx/store';
import {
  selectIssuesByDisputeId,
  selectCurrentDisputeId,
  selectDocumentsByDispute,
  selectPeopleByDispute,
  selectAllEvidence
} from '../../_store/selectors';

export const selectEvidencesForEvidencesPage = createSelector(
  selectAllEvidence,
  selectIssuesByDisputeId,
  selectCurrentDisputeId,
  selectDocumentsByDispute,
  selectPeopleByDispute,
  (evidences: Array<any>, issues: Array<any>, disputeId, documents, people) => {
    const results = [];
    const listEvidences = evidences.filter((evidence: any) => {
      return (evidence.disputeId && evidence.disputeId.toString() === disputeId);
    });

    listEvidences.forEach((evidence: any) => {
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

      newEvidence.document = documents.filter(doc => doc.id === evidence.documentId)[0];
      newEvidence.people = people.filter(person => person.documentIds.indexOf(evidence.documentId) > -1);

      results.push(newEvidence);
    });
    return results;

  }
);
