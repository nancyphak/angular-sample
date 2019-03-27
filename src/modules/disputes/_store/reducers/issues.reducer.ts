import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Error } from 'modules/app/_store';
import { Issue } from '../../models';
import * as fromIssues from '../actions/issues.action';
import * as actionTypes from '../actions/issue-action-type';
import * as _ from 'lodash';

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

function* processData(data) {
  if (!data) {
    return;
  }

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    if (i > 0) {
      value.afterIssueId = data[i - 1].id;
    }
    yield value;

    if (value.children) {
      yield* processData(value.children);
    }
  }
}

export interface State extends EntityState<Issue> {
  draggingIssue: Issue;
  disputeIdOfIssuesEntries: string;
  loaded: boolean;
  loading: boolean;
  error: Error;
  selectedId: string;
}

export function sortByIndex(a: Issue, b: Issue): number {
  return a.index - b.index;
}

export const adapter: EntityAdapter<Issue> = createEntityAdapter<Issue>({
  sortComparer: sortByIndex
});

export const initialState = adapter.getInitialState({
  draggingIssue: null,
  disputeIdOfIssuesEntries: '',
  loaded: false,
  loading: false,
  error: null,
  selectedId: null
});

const errorMessage = 'Sorry, some thing is wrong...';

export function reIndex(issues: Array<Issue>) {
  const treeIssue = listToTree(issues);
  const result = [];
  const it = processData(treeIssue);
  let res = it.next();
  let index = 0;
  while (!res.done) {
    res.value.index = index++;
    result.push(res.value);
    res = it.next();
  }
  return result;
}

export function reducer(state = initialState, action: fromIssues.IssuesAction): State {
  switch (action.type) {
    case actionTypes.LOAD_ISSUES: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case actionTypes.LOAD_ISSUES_SUCCESS: {
      const issues = reIndex(_.cloneDeep(action.payload.issues));

      return adapter.upsertMany(issues, {
        ...state,
        disputeIdOfIssuesEntries: action.payload.disputeIdOfIssuesEntries,
        loaded: true,
        loading: false,
        error: null
      });
    }

    case actionTypes.LOAD_ISSUES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.CREATE_ISSUE: {
      const issue: Issue = {
        ...action.payload.issue
      };
      const issues = Object.keys(state.entities).map(id => _.cloneDeep(state.entities[id]));
      let updateIssues = [];
      issues.sort((a, b) => {
        return a.index - b.index;
      });
      issues.unshift(issue);
      updateIssues = reIndex(issues);

      return adapter.addAll(updateIssues, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.CREATE_ISSUE_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.CREATE_ISSUE_FAIL: {
      return {
        ...state,
        loading: false,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.UPDATE_ISSUE: {
      const issue = action.payload;
      return adapter.updateOne({ id: issue.id, changes: issue }, {
        ...state,
        error: null
      });
    }

    case actionTypes.UPDATE_ISSUE_SUCCESS: {
      return adapter.updateOne(action.payload.issue, {
        ...state,
        error: null
      });
    }

    case actionTypes.UPDATE_ISSUE_FAIL: {
      return {
        ...state,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_ISSUE: {
      let issues = Object.keys(state.entities).map(id => _.cloneDeep(state.entities[id]));
      issues = issues.filter(x => x.id !== action.payload.issue.id);
      issues.sort((a, b) => {
        return a.index - b.index;
      });
      for (let i = 0; i < issues.length; i++) {
        if (issues[i].afterIssueId === action.payload.issue.id) {
          issues[i].afterIssueId = null;
          break;
        }
      }

      const indexedIssues = reIndex(issues);
      const updateIssues = indexedIssues.map(x => {
        return {
          id: x.id,
          changes: x
        };
      });
      return adapter.updateMany(updateIssues, adapter.removeOne(action.payload.issue.id, {
        ...state
      }));
    }

    case actionTypes.REMOVE_ISSUE_FAIL: {
      return {
        ...state,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.SET_ISSUE_NOTES: {
      const issue = action.payload;
      return adapter.updateOne({ id: issue.id, changes: issue }, {
        ...state,
        error: null
      });
    }

    case actionTypes.SET_ISSUE_NOTES_FAIL: {
      return {
        ...state,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.REMOVE_ISSUE_NOTES: {
      const update = {
        id: action.payload.id, changes: {
          ...action.payload,
          notes: ''
        }
      };

      return adapter.updateOne(update, {
        ...state,
        error: null
      });
    }

    case actionTypes.REMOVE_ISSUE_NOTES_FAIL: {
      return {
        ...state,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    case actionTypes.SET_ISSUE_ORDER: {
      const issueIds = action.payload.issueIds;
      const newEntities = _.cloneDeep(state.entities);

      issueIds.forEach((id, index) => {
        newEntities[id].index = index;
      });

      const updates = Object.keys(newEntities).map(id => {
        return {
          id: id,
          changes: newEntities[id]
        };
      });

      return adapter.updateMany(updates, {
        ...state,
        loading: true,
        error: null
      });
    }

    case actionTypes.SET_ISSUE_ORDER_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null
      };
    }

    case actionTypes.ISSUE_DROPPED_ON_ISSUE: {
      const draggingIssue = state.draggingIssue;
      const targetIssue = action.payload.targetIssue;
      let issues = Object.keys(state.entities).map(id => _.cloneDeep(state.entities[id]));
      issues.sort((a, b) => {
        return a.index - b.index;
      });

      issues = issues.filter(x => x.id !== draggingIssue.id);
      issues.splice(targetIssue.index, 0, {
        ...draggingIssue,
        parentIssueId: targetIssue.id,
        afterIssueId: undefined
      });

      const indexedIssues = reIndex(issues);
      const updateIssues = indexedIssues.map(x => {
        return {
          id: x.id,
          changes: x
        };
      });

      return adapter.updateMany(updateIssues, state);
    }

    case actionTypes.ISSUE_DROPPED_BEFORE_ISSUE: {
      let draggingIssue = state.draggingIssue;
      const beforeIssue = action.payload.beforeIssue;
      let issues = Object.keys(state.entities).map(id => _.cloneDeep(state.entities[id]));
      issues.sort((a, b) => {
        return a.index - b.index;
      });
      issues = issues.filter(x => x.id !== draggingIssue.id);
      const pop = draggingIssue.index > beforeIssue.index ? beforeIssue.index : beforeIssue.index - 1;
      draggingIssue = {
        ...draggingIssue,
        parentIssueId: beforeIssue.parentIssueId,
        afterIssueId: beforeIssue.afterIssueId
      };
      issues.splice(pop, 0, draggingIssue);

      const indexedIssues = reIndex(issues);
      const updateIssues = indexedIssues.map(x => {
        return {
          id: x.id,
          changes: x
        };
      });
      return adapter.updateMany(updateIssues, {
        ...state,
        loading: true
      });
    }

    case actionTypes.ISSUE_DROPPED_BEFORE_ISSUE_SUCCESS:
    case actionTypes.ISSUE_DROPPED_BEFORE_ISSUE_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    case actionTypes.ISSUE_DROPPED_AFTER_ISSUE: {
      let draggingIssue = state.draggingIssue;
      const afterIssue = action.payload.afterIssue;
      let issues = Object.keys(state.entities).map(id => _.cloneDeep(state.entities[id]));
      issues.sort((a, b) => {
        return a.index - b.index;
      });
      issues = issues.filter(x => x.id !== draggingIssue.id);
      draggingIssue = {
        ...draggingIssue,
        parentIssueId: afterIssue.parentIssueId,
        afterIssueId: afterIssue.id
      };
      issues.splice(afterIssue.index + 1, 0, draggingIssue);

      const indexedIssues = reIndex(issues);
      const updates = indexedIssues.map(x => {
        return {
          id: x.id,
          changes: x
        };
      });
      return adapter.updateMany(updates, state);
    }

    case actionTypes.ISSUE_DRAG_STARTED: {
      return {
        ...state,
        draggingIssue: action.payload.issue,
      };
    }

    case actionTypes.SELECT_ISSUE: {
      return {
        ...state,
        selectedId: action.payload
      };
    }

    case actionTypes.BACK_TO_LIST_ISSUE: {
      return {
        ...state,
        selectedId: null,
      };
    }

    case actionTypes.USER_LEFT_ISSUE_VIEW: {
      return {
        ...state,
        selectedId: null
      };
    }

    case actionTypes.SET_ISSUE_NOTES_HEIGHT: {
      const issue = action.payload.issueNotes;
      return adapter.updateOne({ id: issue.issueId, changes: { notesHeightPreference: issue.height} }, {
        ...state,
        error: null
      });
    }

    case actionTypes.SET_ISSUE_NOTES_HEIGHT_FAIL: {
      return {
        ...state,
        error: {
          message: errorMessage,
          failedAction: action.payload.failedAction
        }
      };
    }

    default: {
      return state;
    }
  }
}

export const getIssuesLoading = (state: State) => state.loading;
export const getIssuesLoaded = (state: State) => state.loaded;
export const getError = (state: State) => state.error;
export const getIssueIds = (state: State) => state.ids;
export const getDraggingIssue = (state: State) => state.draggingIssue;
export const getSelectedId = (state: State) => state.selectedId;
export const getDisputeIdOfIssuesEntries = (state: State) => state.disputeIdOfIssuesEntries;

