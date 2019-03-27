import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPleadings from '../reducers/pleadings.reducer';
import { selectCurrentDisputeId } from './disputes.selector';
import { selectIssuesByDisputeId } from './issues.selector';
import { Issue, Pleading } from '../../models';

export const selectPleadingsState = createSelector(
  fromFeature.getDisputeState,
  (state: fromFeature.DisputeState) => state.pleadings);

export const {
  selectAll: selectAllPleadings
} = fromPleadings.adapter.getSelectors(selectPleadingsState);

export const selectPleadingsByDispute = createSelector(
  selectAllPleadings,
  selectCurrentDisputeId,
  (pleadings, disputeId) => {
    return pleadings.filter((pleading) => {
      return pleading.disputeId && pleading.disputeId.toString() === disputeId;
    });
  }
);

export const selectPleadingsLoading = createSelector(
  selectPleadingsState,
  fromPleadings.getPleadingsLoading
);

export const selectPleadingsLoaded = createSelector(
  selectPleadingsState,
  fromPleadings.getPleadingsLoaded
);

export const selectDisputeIdOfPleadingEntries = createSelector(
  selectPleadingsState,
  fromPleadings.getDisputeIdOfEntries
);

export const selectPleadingError = createSelector(
  selectPleadingsState,
  fromPleadings.getError
);
export const selectParagraphParagraphIds = createSelector(
  selectPleadingsState,
  fromPleadings.getParagraphIds
);

export const checkIfPleadingExistedForSelectedDispute = createSelector(
  selectAllPleadings,
  selectCurrentDisputeId,
  (pleadings, currentDisputeId) => {
    return pleadings.some((pleading) => {
      return pleading.disputeId && pleading.disputeId === currentDisputeId;
    });
  }
);

export const selectIssuesAssociatedWithSentence = createSelector(
  selectIssuesByDisputeId,
  selectPleadingsByDispute,
  (issues: Array<Issue>, pleadings: Array<Pleading>) => {
    issues.sort((a, b) => {
      return a.index - b.index;
    });
    return issues.map((issue: Issue) => {

      const pleadingsOfIssue = [];
      pleadings.forEach((pleading) => {
        const pleadingItem = {
          id: pleading.id,
          title: pleading.title,
          sentences: [],
          responses: []
        };
        pleading.sentences.forEach(sentence => {
          if (sentence.issueIds.some(issueId => issueId === issue.id)) {
            pleadingItem.sentences.push(sentence);
          }
        });

        pleading.responses.forEach((response) => {
          const responseItem = {
            id: response.id,
            title: response.title,
            sentences: []
          };

          response.sentences.forEach(sentence => {
            if (sentence.issueIds.some(issueId => issueId === issue.id)) {
              responseItem.sentences.push(sentence);
            }
          });
          if (responseItem.sentences.length > 0) {
            pleadingItem.responses.push(responseItem);
          }
        });

        if (pleadingItem.sentences.length > 0 || pleadingItem.responses.length > 0) {
          pleadingsOfIssue.push(pleadingItem);
        }
      });

      const pleadingsOfIssueWithConcatedSentenceText = pleadingsOfIssue.map(pleadingItem => {
        return {
          ...pleadingItem,
          concatedSentences: pleadingItem.sentences.map(s => s.text).join(' '),
          responses: pleadingItem.responses.map(responseItem => ({
            ...responseItem,
            concatedSentences: responseItem.sentences.map(s => s.text).join(' '),

          }))
        };
      });

      return {
        ...issue,
        pleadings: pleadingsOfIssueWithConcatedSentenceText
      };
    });
  }
);
