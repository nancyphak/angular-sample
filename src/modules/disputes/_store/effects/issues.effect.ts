import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { catchError, map, mapTo, switchMap, concatMap, withLatestFrom, filter } from 'rxjs/operators';

import { Router } from '@angular/router';

import { appConfig } from '@app/config';
import { Undo, Go, getRouterState } from 'modules/app/_store';
import { Issue, SetIssuePositionModel, UpdateIssueModel } from '../../models';
import { IssuesService } from '../../services';
import { selectDraggingIssue, selectAllIssues } from '../selectors';
import * as issuesActions from '../actions/issues.action';
import * as actionTypes from '../actions/issue-action-type';
import * as fromStore from '../index';

@Injectable()
export class IssuesEffects {
  constructor(private actions$: Actions,
              private store: Store<fromStore.DisputeState>,
              private router: Router,
              private issuesService: IssuesService) {
  }

  @Effect()
  loadIssues$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_ISSUES, actionTypes.LOAD_ISSUES_SILENT),
    map((action: issuesActions.LoadIssues) => action),
    switchMap((action) => {
      return this.issuesService
        .getIssues(action.payload.disputeId)
        .pipe(
          map((issues) => {
            let issuesArray: Array<Issue> = [];
            if (issues && issues.length > 0) {
              issuesArray = issues.map(e => {
                return {...e, disputeId: action.payload.disputeId};
              });
            }
            return new issuesActions.LoadIssuesSuccess({
              issues: issuesArray,
              disputeIdOfIssuesEntries: action.payload.disputeId
            });
          }),
          catchError(() => of(new issuesActions.LoadIssuesFail({failedAction: action})))
        );
    })
  );

  @Effect()
  onLoadIssuesSuccess$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_ISSUES_SUCCESS),
    map((action: issuesActions.LoadIssuesSuccess) => action.payload),
    switchMap((payload) => {
      return timer(appConfig.getDataSilentTimer).pipe(
        mapTo(payload.disputeIdOfIssuesEntries)
      );
    }),
    withLatestFrom(this.store.pipe(select(getRouterState))),
    filter(([disputeId, routerState]) => {
      return routerState.state.url.includes(disputeId);
    }),
    map(([disputeId]) => {
      return new issuesActions.LoadIssuesSilent({disputeId});
    })
  );

  @Effect()
  createIssue$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_ISSUE),
    map((action: issuesActions.CreateIssue) => action),
    switchMap(action => {
      return this.issuesService
        .createIssue(action.payload.issue)
        .pipe(
          map(() => new issuesActions.CreateIssueSuccess({
            issue: action.payload.issue,
            options: action.payload.options
          })),
          catchError(() => of(new issuesActions.CreateIssueFail({failedAction: action})))
        );
    })
  );

  @Effect()
  handleCreateSuccess$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_ISSUE_SUCCESS),
    map((action: issuesActions.CreateIssueSuccess) => action.payload),
    filter(payload => payload.options && payload.options.navigateToDetailOnSuccess),
    map((payload) => {
      const url = `disputes/${payload.issue.disputeId}/issues/${payload.issue.id}`;
      return new Go({
        path: [url]
      });
    })
  );

  @Effect()
  updateIssue$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_ISSUE),
    map((action: issuesActions.UpdateIssue) => action),
    switchMap(action => {
      const issueToUpdate: UpdateIssueModel = {
        id: action.payload.id,
        disputeId: action.payload.disputeId,
        newName: action.payload.name
      };
      return this.issuesService
        .updateIssue(issueToUpdate)
        .pipe(
          map(() => {
            return new issuesActions.UpdateIssueSuccess(
              {
                issue: {id: action.payload.id, changes: action.payload}
              }
            );
          }),
          catchError(() => of(new issuesActions.UpdateIssueFail({failedAction: action})))
        );
    })
  );

  @Effect()
  removeIssue$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_ISSUE),
    map((action: issuesActions.RemoveIssue) => action),
    concatMap(action => {
      return this.issuesService
        .removeIssue(action.payload.issue)
        .pipe(
          map(() => new issuesActions.RemoveIssueSuccess({
            issue: action.payload.issue,
            options: action.payload.options
          })),
          catchError(() => of(new issuesActions.RemoveIssueFail({failedAction: action})))
        );
    })
  );

  @Effect()
  handleDeleteSuccess$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_ISSUE_SUCCESS),
    map((action: issuesActions.RemoveIssueSuccess) => action.payload),
    withLatestFrom(this.store.pipe(select(selectAllIssues))),
    map(([removedIssue, issues]) => {
      if (!removedIssue.options) {
        const url = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
        return new Go({path: [url]});
      }
      if (issues && issues.length > 0 && removedIssue.options && removedIssue.options.navigateToDetailOnSuccess) {
        const url = `disputes/${removedIssue.issue.disputeId}/issues/${issues[0].id}`;
        return new Go({path: [url]});
      } else {
        const url = `disputes/${removedIssue.issue.disputeId}/issues`;
        return new Go({path: [url]});
      }
    })
  );

  @Effect()
  setIssueNotes$ = this.actions$.pipe(
    ofType(actionTypes.SET_ISSUE_NOTES),
    map((action: issuesActions.SetIssueNotes) => action),
    switchMap(action => {
      return this.issuesService
        .setIssueNotes(action.payload)
        .pipe(
          map(() => new issuesActions.SetIssueNotesSuccess(action.payload)),
          catchError(() => of(new issuesActions.SetIssueNotesFail({failedAction: action})))
        );
    })
  );

  @Effect()
  removeIssueNotes$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_ISSUE_NOTES),
    map((action: issuesActions.RemoveIssueNotes) => action),
    switchMap(action => {
      return this.issuesService
        .removeIssueNotes(action.payload)
        .pipe(
          map(() => new issuesActions.RemoveIssueNotesSuccess(action.payload)),
          catchError(() => of(new issuesActions.RemoveIssueNotesFail({failedAction: action})))
        );
    })
  );

  @Effect()
  setIssueOrdering$ = this.actions$.pipe(
    ofType(actionTypes.SET_ISSUE_ORDER),
    map((action: issuesActions.SetIssueOrder) => action),
    switchMap(action => {
      return this.issuesService
        .setIssueOrdering(action.payload)
        .pipe(
          map(() => new issuesActions.SetIssueOrderSuccess()),
          catchError(() => of(new issuesActions.SetIssueOrderFail({failedAction: action})))
        );
    })
  );

  @Effect()
  dropIssueOnIssue$ = this.actions$.pipe(
    ofType(actionTypes.ISSUE_DROPPED_ON_ISSUE),
    map((action: issuesActions.IssueDroppedOnIssue) => action),
    withLatestFrom(this.store.pipe(select(selectDraggingIssue))),
    switchMap(([action, draggingIssue]) => {
      const payload: SetIssuePositionModel = {
        disputeId: draggingIssue.disputeId,
        issueId: draggingIssue.id,
        parentIssueId: action.payload.targetIssue.id
      };
      return this.issuesService
        .setIssuePosition(payload)
        .pipe(
          map(() => new issuesActions.IssueDroppedOnIssueSuccess()),
          catchError(() => of(new issuesActions.IssueDroppedOnIssueFail({failedAction: action})))
        );
    })
  );

  @Effect()
  dropIssueBeforeIssue$ = this.actions$.pipe(
    ofType(actionTypes.ISSUE_DROPPED_BEFORE_ISSUE),
    map((action: issuesActions.IssueDroppedBeforeIssue) => action),
    withLatestFrom(this.store.pipe(select(selectDraggingIssue))),
    switchMap(([action, draggingIssue]) => {
      const payload: SetIssuePositionModel = {
        disputeId: draggingIssue.disputeId,
        issueId: draggingIssue.id,
        parentIssueId: action.payload.beforeIssue.parentIssueId,
        afterIssueId: action.payload.beforeIssue.afterIssueId
      };
      return this.issuesService
        .setIssuePosition(payload)
        .pipe(
          map(() => new issuesActions.IssueDroppedBeforeIssueSuccess()),
          catchError(() => of(new issuesActions.IssueDroppedBeforeIssueFail({failedAction: action})))
        );
    })
  );

  @Effect()
  dropIssueAfterIssue$ = this.actions$.pipe(
    ofType(actionTypes.ISSUE_DROPPED_AFTER_ISSUE),
    map((action: issuesActions.IssueDroppedAfterIssue) => action),
    withLatestFrom(this.store.pipe(select(selectDraggingIssue))),
    switchMap(([action, draggingIssue]) => {
      const payload: SetIssuePositionModel = {
        disputeId: draggingIssue.disputeId,
        issueId: draggingIssue.id,
        parentIssueId: action.payload.afterIssue.parentIssueId,
        afterIssueId: action.payload.afterIssue.id
      };
      return this.issuesService
        .setIssuePosition(payload)
        .pipe(
          map((res) => new issuesActions.IssueDroppedAfterIssueSuccess(res)),
          catchError(() => of(new issuesActions.IssueDroppedAfterIssueFail({failedAction: action})))
        );
    })
  );

  @Effect()
  setIssueNotesHeight$ = this.actions$.pipe(
    ofType(actionTypes.SET_ISSUE_NOTES_HEIGHT),
    map((action: issuesActions.SetIssueNotesHeight) => action),
    switchMap(action => {
      return this.issuesService
        .setIssueNotesHeight(action.payload.issueNotes)
        .pipe(
          map(() => new issuesActions.SetIssueNotesHeightSuccess(action.payload.issueNotes)),
          catchError(() => of(new issuesActions.SetIssueNotesHeightFail({failedAction: action})))
        );
    })
  );

  @Effect()
  handleCreateError$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_ISSUE_FAIL),
    map(() => new Undo(actionTypes.CREATE_ISSUE))
  );

  @Effect()
  handleUpdateError$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_ISSUE_FAIL),
    map(() => new Undo(actionTypes.UPDATE_ISSUE))
  );

  @Effect()
  handleDeleteError$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_ISSUE_FAIL),
    map(() => new Undo(actionTypes.REMOVE_ISSUE))
  );

  @Effect()
  handleSetIssueNotesError$ = this.actions$.pipe(
    ofType(actionTypes.SET_ISSUE_NOTES_FAIL),
    map(() => new Undo(actionTypes.SET_ISSUE_NOTES))
  );

  @Effect()
  handleRemoveIssueNotesError$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_ISSUE_NOTES_FAIL),
    map(() => new Undo(actionTypes.REMOVE_ISSUE_NOTES))
  );
  @Effect()
  handleSetIssueOrderError$ = this.actions$.pipe(
    ofType(actionTypes.SET_ISSUE_ORDER_FAIL),
    map(() => new Undo(actionTypes.SET_ISSUE_ORDER))
  );

}
