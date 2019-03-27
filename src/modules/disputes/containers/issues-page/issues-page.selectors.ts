import { createSelector } from '@ngrx/store';
import { selectDocumentEntities, selectEvidencesForDispute, selectIssuesByDisputeId } from 'modules/disputes/_store';
import { filter, flow, groupBy, map, toPairs } from 'lodash/fp';

import * as _ from 'lodash';

import { DocumentModel, Evidence, Issue, Pleading } from '../../models';
import { IssueItem } from './issues-page.model';
import { selectCurrentIssue, selectPleadingsByDispute } from '../../_store/selectors';

interface DocumentEntities {
  [id: string]: DocumentModel;
}

const evidenceIsForIssue = (issueId: string) => (ev: Evidence) => ev.issueIds.some(id => id === issueId);

const createEvidenceModel = (issueId: string, evidences: Evidence[], docEntities: DocumentEntities) =>
  flow(
    filter(evidenceIsForIssue(issueId)),
    groupBy(ev => ev.documentId),
    toPairs,
    map(([documentId, evidenceForDocument]) => {
      return {
        documentId: documentId,
        documentName: docEntities[documentId] ? docEntities[documentId].name : '',
        evidenceItems: evidenceForDocument.map(ev => ({
          evidenceId: ev.id,
          evidenceText: ev.text,
          evidencePage: ev.pageNumber
        }))
      };
    })
  )(evidences);

const createPleadingModel = (issueId, pleadings): Array<Pleading> => {
  const arr = [];
  const mapObj = new Map();
  pleadings.forEach(pleading => {
    const item = {
      id: pleading.id,
      title: pleading.title,
      concatedSentences: '',
      responses: []
    };
    pleading.sentences.forEach(sentence => {
      if (sentence.issueIds.some(id => id === issueId)) {
        item.concatedSentences += sentence.text + ' ';
        mapObj.set(pleading.id, item);
      }
    });

    pleading.responses.forEach(response => {
      let concatedSentences = '';
      response.sentences.forEach(sentence => {
        if (sentence.issueIds.some(id => id === issueId)) {
          concatedSentences += sentence.text + ' ';
        }
      });
      if (concatedSentences !== '') {
        item.responses.push({
          id: response.id,
          title: response.title,
          concatedSentences: concatedSentences
        });
        mapObj.set(pleading.id, item);
      }
    });
  });

  mapObj.forEach(value => {
    arr.push(value);
  });
  return arr;
};

export function listToTree(array: Array<any>) {
  if (!array) {
    return null;
  }
  const tree = [],
    mappedArr = {};
  let arrElem,
    mappedElem;
  for (let i = 0, len = array.length; i < len; i++) {
    arrElem = array[i];
    if (arrElem.parentIssueId === '00000000-0000-0000-0000-000000000000') {
      arrElem.parentIssueId = undefined;
    }
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['children'] = [];
  }

  for (const id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      if (mappedElem.parentIssueId) {
        const parent = mappedArr[mappedElem['parentIssueId']];
        if (parent) {
          parent['children'].push(mappedElem);
        }
      } else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}

const createTreeIssues =
  (issues: Array<Issue>) => {
    const arr = _.cloneDeep(issues);
    return listToTree(arr);
  };

export const selectTreeIssues = createSelector(
  selectIssuesByDisputeId,
  createTreeIssues
);

export const createIssueModel =
  (evidences: Evidence[],
   pleadings: Pleading[],
   issues: Issue[],
   docEntities: DocumentEntities,
   issue: Issue): IssueItem => {
    if (!issue) {
      return null;
    }
    return {
      id: issue.id,
      name: issue.name,
      entity: issue,
      pleadings: createPleadingModel(issue.id, pleadings),
      evidence: createEvidenceModel(issue.id, evidences, docEntities)
    };
  };

export const selectSelectedIssue = createSelector(
  selectEvidencesForDispute,
  selectPleadingsByDispute,
  selectIssuesByDisputeId,
  selectDocumentEntities,
  selectCurrentIssue,
  createIssueModel
);
