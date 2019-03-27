import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { filter, flow, groupBy, map, toPairs } from 'lodash/fp';

import { convertTreeToList } from 'modules/shared/utilities';
import { selectCurrentIssue, selectIssuesByDisputeId } from './issues.selector';
import { IssueDetailModel, Evidence, Pleading, DocumentModel, IssueEvidence, Person } from '../../models';
import { selectEvidencesForDispute } from './evidences.selector';
import { selectPleadingsByDispute } from './pleadings.selector';
import { selectPeopleByDispute } from './people.selector';
import { selectDocumentsByDispute, selectDocumentEntities } from './documents.selector';

const getChildrenIssue = (issues, currentIssue) => {
  const issueChildren = [];
  if (currentIssue.children.length > 0) {
    const listIssueChildren = convertTreeToList(currentIssue);
    issues.forEach(issue => {
      if (listIssueChildren.some(child => child.id === issue.id)) {
        issueChildren.push(issue);
      }
    });

    return issueChildren;
  } else {
    return convertTreeToList(currentIssue);
  }

};

const getChildren = (currentIssue) => {
  if (!currentIssue) {
    return [];
  }
  return convertTreeToList(currentIssue);
};

interface DocumentEntities {
  [id: string]: DocumentModel;
}

const evidenceIsForIssue = (issueIds: Array<string>) => (ev: Evidence) => {
  const intersects = _.intersection(ev.issueIds, issueIds);
  return intersects && intersects.length > 0;
};

const createEvidenceModel = (issueIds: Array<string>, evidences: Evidence[], docEntities: DocumentEntities): Array<IssueEvidence> =>
  flow(
    filter(evidenceIsForIssue(issueIds)),
    groupBy(ev => ev.documentId),
    toPairs,
    map(([documentId, evidenceForDocument]) => {
      const document = docEntities[documentId];
      return {
        document: document,
        evidenceItems: evidenceForDocument.map(ev => ({
          evidenceId: ev.id,
          evidenceText: ev.text,
          evidencePage: ev.pageNumber
        }))
      };
    })
  )(evidences);

function selectPleadingsAssociatedWithIssueAndItsChildren(pleadings: Array<Pleading>, issueIds: Array<string>) {
  let sentenceIds = [];
  let sentenceResponseIds = [];
  let responseIds = [];
  let result = pleadings.filter(pleading => {
    const sentences = pleading.sentences.filter(sentence => {
      const intersects = _.intersection(sentence.issueIds, issueIds);
      return intersects && intersects.length > 0;
    });

    const ids = sentences.map(sentence => sentence.id);

    sentenceIds = sentenceIds.concat(ids);

    const responses = pleading.responses.filter(response => {
      const sentencesOfThisResponse = response.sentences.filter(sentence => {
        const intersects = _.intersection(sentence.issueIds, issueIds);
        return intersects && intersects.length > 0;
      });

      const sIds = sentencesOfThisResponse.map(sentence => sentence.id);

      sentenceResponseIds = sentenceResponseIds.concat(sIds);

      return sentencesOfThisResponse && sentencesOfThisResponse.length > 0;
    });

    const rIds = responses.map(res => res.id);

    responseIds = responseIds.concat(rIds);
    return sentences && sentences.length > 0 || responses && responses.length > 0;

  });

  result = result.map(pleading => {
    const concatedSentences = pleading.sentences.map(x => {
      if (sentenceIds.some(id => id === x.id)) {
        return x.text;
      }
      return '';
    }).join(' ');

    const responses = pleading.responses
      .filter(response => {
        return responseIds.some(id => id === response.id);

      })
      .map(response => {
        const concatedSentencesOfResponse = response.sentences.map(x => {
          if (sentenceResponseIds.some(id => id === x.id)) {
            return x.text;
          }
          return '';
        }).join(' ');
        return {
          ...response,
          concatedSentences: concatedSentencesOfResponse
        };
      });
    return {
      ...pleading,
      concatedSentences,
      responses
    };
  });
  return result;
}

function selectPeopleAssociatedWithIssueAndItsChildren(documents: Array<DocumentModel>,
                                                       people: Array<Person>) {
  if (!documents || documents.length < 1 || documents[0] === undefined) {
    return [];
  }
  const documentIds = documents.map(x => x.id);
  return people.filter(person => {
    const intersects = _.intersection(documentIds, person.documentIds);
    return intersects && intersects.length > 0;
  });
}

export const selectIssueDetail = createSelector(
  selectCurrentIssue,
  selectIssuesByDisputeId,
  selectEvidencesForDispute,
  selectPleadingsByDispute,
  selectPeopleByDispute,
  selectDocumentsByDispute,
  selectDocumentEntities,
  (currentIssue, issues, evidences, pleadings, people, documents, documentEntities): IssueDetailModel => {
    if (!currentIssue) {
      return null;
    }
    const issueChildren = issues.filter(x => x.parentIssueId === currentIssue.id);
    const children = getChildren(currentIssue);
    const issueIds = [currentIssue.id, ...children.map(x => x.id)];
    const filteredEvidences = createEvidenceModel(issueIds, evidences, documentEntities);
    const filteredDocuments = filteredEvidences.map(x => x.document).filter(x => !!x);
    const filteredPeople = selectPeopleAssociatedWithIssueAndItsChildren(filteredDocuments, people);
    const filteredPleadings = selectPleadingsAssociatedWithIssueAndItsChildren(pleadings, issueIds);

    const entity = {...currentIssue};
    return {
      id: currentIssue.id,
      entity: entity,
      children: issueChildren,
      evidences: filteredEvidences,
      pleadings: filteredPleadings,
      people: filteredPeople,
      documents: filteredDocuments
    };
  }
);
