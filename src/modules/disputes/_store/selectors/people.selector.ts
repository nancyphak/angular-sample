import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import * as fromFeature from '../reducers';
import * as fromPeople from '../reducers/people.reducer';
import { selectCurrentDisputeId } from './disputes.selector';
import { selectEvidencesForDispute } from './evidences.selector';
import { selectIssuesByDisputeId } from './issues.selector';
import { selectCurrentDocument, selectAllDocuments, selectCurrentSidekickDocument } from './documents.selector';
import { DocumentModel, Evidence, Issue, Person, PersonDetailViewModel } from '../../models';

export const selectPeopleState = createSelector(
  fromFeature.getDisputeState,
  (state: fromFeature.DisputeState) => state.people);

export const {
  selectAll: selectAllPeople
} = fromPeople.adapter.getSelectors(selectPeopleState);

export const selectPeopleByDispute = createSelector(
  selectAllPeople,
  selectCurrentDisputeId,
  (people, disputeId) => {
    return people.filter((person) => {
      return person.disputeId && person.disputeId.toString() === disputeId;
    });
  }
);

export const checkIfPeopleExistedForSelectedDispute = createSelector(
  selectAllPeople,
  selectCurrentDisputeId,
  (people, disputeId) => {
    return people.some((person) => {
      return person.disputeId && person.disputeId.toString() === disputeId;
    });
  }
);

export const selectPeopleAssociatedWithDocumentByDispute = createSelector(
  selectPeopleByDispute,
  selectCurrentDocument, (people, document) => {
    if (document && people && people.length && people.length > 0) {
      return people.filter((person) => {
        return (person.documentIds && person.documentIds.some((documentId) => documentId === document.id));
      });
    }
    return [];
  }
);

export const selectPeopleIdsAssociatedWithDocumentByDispute = createSelector(
  selectPeopleAssociatedWithDocumentByDispute,
  (people) => {
    return people.map(person => person.id);
  }
);

export const selectPeopleAssociatedWithDocument = createSelector(
  selectPeopleAssociatedWithDocumentByDispute,
  (people) => {
    return people.map(person => person.name).join(', ');
  }
);

export const selectSelectedPerson = createSelector(
  selectPeopleState,
  fromPeople.getSelectedPerson
);

const createPersonDetailPageModel =
  (person: Person,
   issues: Array<Issue>,
   evidences: Array<Evidence>,
   docs: Array<DocumentModel>): PersonDetailViewModel => {

    if (!person) {
      return null;
    }

    const filteredDocuments = _.filter(docs, (doc) => _.includes(person.documentIds, doc.id));
    const filteredEvidences = _.filter(evidences, (e) => _.includes(person.documentIds, e.documentId));
    filteredEvidences.forEach(e => {
      e.issues = _.filter(issues, (issue) => _.includes(e.issueIds, issue.id));
    });

    const documents = filteredDocuments.map((doc) => {
      const listEvidences = filteredEvidences.filter(e => e.documentId === doc.id);
      return {
        ...doc,
        evidences: listEvidences
      };
    });

    return {
      id: person.id,
      name: person.name,
      disputeId: person.disputeId,
      documentIds: person.documentIds,
      documents: documents
    };

  };

export const selectPersonDetailData = createSelector(
  selectSelectedPerson,
  selectIssuesByDisputeId,
  selectEvidencesForDispute,
  selectAllDocuments,
  createPersonDetailPageModel
);

export const selectPeopleLoading = createSelector(
  selectPeopleState,
  fromPeople.getPeopleLoading
);
export const selectPeopleLoaded = createSelector(
  selectPeopleState,
  fromPeople.getPeopleLoaded
);

export const selectPersonError = createSelector(
  selectPeopleState,
  fromPeople.getError
);

export const selectDisputeIdOfPeopleEntries = createSelector(
  selectPeopleState,
  fromPeople.getDisputeIdOfPeopleEntries
);

export const selectPeopleAssociatedWithSidekickDocumentByDispute = createSelector(
  selectPeopleByDispute,
  selectCurrentSidekickDocument, (people, document) => {
    if (document && people && people.length && people.length > 0) {
      return people.filter((person) => {
        return (person.documentIds && person.documentIds.some((documentId) => documentId === document.id));
      });
    }
    return [];
  }
);

export const selectPeopleAssociatedWithSidekickDocument = createSelector(
  selectPeopleAssociatedWithSidekickDocumentByDispute,
  (people) => {
    return people.map(person => person.name).join(', ');
  }
);

export const selectPeopleIdsAssociatedWithSidekickDocumentByDispute = createSelector(
  selectPeopleAssociatedWithSidekickDocumentByDispute,
  (people) => {
    return people.map(person => person.id);
  }
);



