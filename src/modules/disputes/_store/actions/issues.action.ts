import { Action } from '@ngrx/store';

import { Error } from 'modules/app/_store';
import { Issue, IssueOrderingModel, SetIssueNotesHeightModel } from '../../models';
import * as actionTypes from './issue-action-type';

export class LoadIssues implements Action {
  readonly type = actionTypes.LOAD_ISSUES;

  constructor(public payload: { disputeId: string }) {
  }
}

export class LoadIssuesSilent implements Action {
  readonly type = actionTypes.LOAD_ISSUES_SILENT;

  constructor(public payload: { disputeId: string }) {
  }
}

export class LoadIssuesSuccess implements Action {
  readonly type = actionTypes.LOAD_ISSUES_SUCCESS;

  constructor(public payload: { disputeIdOfIssuesEntries: string, issues: Array<Issue> }) {
  }
}

export class LoadIssuesFail implements Action {
  readonly type = actionTypes.LOAD_ISSUES_FAIL;

  constructor(public payload: Error) {
  }
}

export class CreateIssue implements Action {
  readonly type = actionTypes.CREATE_ISSUE;

  constructor(public payload: { issue: Issue, options?: { navigateToDetailOnSuccess: boolean } }) {
  }
}

export class CreateIssueSuccess implements Action {
  readonly type = actionTypes.CREATE_ISSUE_SUCCESS;

  constructor(public payload: { issue: Issue, options?: { navigateToDetailOnSuccess: boolean   } }) {
  }
}

export class CreateIssueFail implements Action {
  readonly type = actionTypes.CREATE_ISSUE_FAIL;

  constructor(public payload?: Error) {
  }
}

export class UpdateIssue implements Action {
  readonly type = actionTypes.UPDATE_ISSUE;

  constructor(public payload: Issue) {
  }
}

export class UpdateIssueSuccess implements Action {
  readonly type = actionTypes.UPDATE_ISSUE_SUCCESS;

  constructor(public payload: { issue: { id: string, changes: Issue } }) {
  }
}

export class UpdateIssueFail implements Action {
  readonly type = actionTypes.UPDATE_ISSUE_FAIL;

  constructor(public payload?: Error) {
  }
}

export class RemoveIssue implements Action {
  readonly type = actionTypes.REMOVE_ISSUE;

  constructor(public payload: { issue: Issue, options?: { navigateToDetailOnSuccess: boolean } }) {
  }
}

export class RemoveIssueSuccess implements Action {
  readonly type = actionTypes.REMOVE_ISSUE_SUCCESS;

  constructor(public payload: { issue: Issue, options?: { navigateToDetailOnSuccess: boolean } }) {
  }
}

export class RemoveIssueFail implements Action {
  readonly type = actionTypes.REMOVE_ISSUE_FAIL;

  constructor(public payload: Error) {
  }
}

export class SetIssueNotes implements Action {
  readonly type = actionTypes.SET_ISSUE_NOTES;

  constructor(public payload: Issue) {
  }
}

export class SetIssueNotesSuccess implements Action {
  readonly type = actionTypes.SET_ISSUE_NOTES_SUCCESS;

  constructor(public payload: Issue) {
  }
}

export class SetIssueNotesFail implements Action {
  readonly type = actionTypes.SET_ISSUE_NOTES_FAIL;

  constructor(public payload: Error) {
  }
}

export class RemoveIssueNotes implements Action {
  readonly type = actionTypes.REMOVE_ISSUE_NOTES;

  constructor(public payload: Issue) {
  }
}

export class RemoveIssueNotesSuccess implements Action {
  readonly type = actionTypes.REMOVE_ISSUE_NOTES_SUCCESS;

  constructor(public payload: Issue) {
  }
}

export class RemoveIssueNotesFail implements Action {
  readonly type = actionTypes.REMOVE_ISSUE_NOTES_FAIL;

  constructor(public payload: Error) {
  }
}

export class SetIssueOrder implements Action {
  readonly type = actionTypes.SET_ISSUE_ORDER;

  constructor(public payload: IssueOrderingModel) {
  }
}

export class SetIssueOrderSuccess implements Action {
  readonly type = actionTypes.SET_ISSUE_ORDER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class SetIssueOrderFail implements Action {
  readonly type = actionTypes.SET_ISSUE_ORDER_FAIL;

  constructor(public payload: Error) {
  }
}

export class IssueDroppedOnIssue implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_ON_ISSUE;

  constructor(public payload: { targetIssue: Issue }) {
  }
}

export class IssueDroppedOnIssueSuccess implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_ON_ISSUE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class IssueDroppedOnIssueFail implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_ON_ISSUE_FAIL;

  constructor(public payload: Error) {
  }
}

export class IssueDroppedBeforeIssue implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_BEFORE_ISSUE;

  constructor(public payload: { beforeIssue: Issue }) {
  }
}

export class IssueDroppedBeforeIssueSuccess implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_BEFORE_ISSUE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class IssueDroppedBeforeIssueFail implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_BEFORE_ISSUE_FAIL;

  constructor(public payload: Error) {
  }
}

export class IssueDroppedAfterIssue implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_AFTER_ISSUE;

  constructor(public payload: { afterIssue: Issue }) {
  }
}

export class IssueDroppedAfterIssueSuccess implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_AFTER_ISSUE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class IssueDroppedAfterIssueFail implements Action {
  readonly type = actionTypes.ISSUE_DROPPED_AFTER_ISSUE_FAIL;

  constructor(public payload: Error) {
  }
}

export class IssueDragStarted implements Action {
  readonly type = actionTypes.ISSUE_DRAG_STARTED;

  constructor(public payload: { issue: Issue }) {
  }
}

export class SelectIssue implements Action {
  readonly type = actionTypes.SELECT_ISSUE;

  constructor(public payload: string) {
  }
}

export class BackToListIssue implements Action {
  readonly type = actionTypes.BACK_TO_LIST_ISSUE;

  constructor(public payload?: string) {
  }
}

export class UserLeftIssueView implements Action {
  readonly type = actionTypes.USER_LEFT_ISSUE_VIEW;

  constructor(public payload?: string) {
  }
}

export class SetIssueNotesHeight implements Action {
  readonly type = actionTypes.SET_ISSUE_NOTES_HEIGHT;

  constructor(public payload: { issueNotes: SetIssueNotesHeightModel }) {
  }
}

export class SetIssueNotesHeightSuccess implements Action {
  readonly type = actionTypes.SET_ISSUE_NOTES_HEIGHT_SUCCESS;

  constructor(public payload: SetIssueNotesHeightModel) {
  }
}

export class SetIssueNotesHeightFail implements Action {
  readonly type = actionTypes.SET_ISSUE_NOTES_HEIGHT_FAIL;

  constructor(public payload: Error) {
  }
}

export type IssuesAction =
  | LoadIssues | LoadIssuesFail | LoadIssuesSuccess | LoadIssuesSilent
  | CreateIssue | CreateIssueFail | CreateIssueSuccess
  | UpdateIssue | UpdateIssueFail | UpdateIssueSuccess
  | RemoveIssue | RemoveIssueFail | RemoveIssueSuccess
  | SetIssueOrder | SetIssueOrderFail | SetIssueOrderSuccess
  | SetIssueNotes | SetIssueNotesFail | SetIssueNotesSuccess
  | RemoveIssueNotes | RemoveIssueNotesFail | RemoveIssueNotesSuccess
  | IssueDroppedOnIssue | IssueDroppedOnIssueSuccess | IssueDroppedOnIssueFail
  | IssueDroppedBeforeIssue | IssueDroppedBeforeIssueSuccess | IssueDroppedBeforeIssueFail
  | IssueDroppedAfterIssue | IssueDroppedAfterIssueSuccess | IssueDroppedAfterIssueFail
  | IssueDragStarted
  | SelectIssue | BackToListIssue | UserLeftIssueView | SelectIssue
  | SetIssueNotesHeight | SetIssueNotesHeightSuccess | SetIssueNotesHeightFail;

