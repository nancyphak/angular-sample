import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { catchError, map, switchMap, mapTo, withLatestFrom, filter, concatMap } from 'rxjs/operators';

import { appConfig } from '@app/config';
import { Undo, getRouterState } from 'modules/app/_store';
import * as pleadingActions from '../actions/pleadings.action';
import { PleadingsService } from '../../services';
import { Pleading, RemoveSentenceModel, UpdateSentenceModel } from '../../models';
import * as actionTypes from '../actions/pleading-action-type';
import * as fromStore from '../index';

@Injectable()
export class PleadingsEffects {
  constructor(private actions$: Actions,
              private store: Store<fromStore.DisputeState>,
              private pleadingsService: PleadingsService) {
  }

  @Effect()
  loadParagraphs$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_PARAGRAPHS, actionTypes.LOAD_PARAGRAPHS_SILENT),
    map((action: pleadingActions.LoadParagraphs) => action),
    switchMap((action) => {
      return this.pleadingsService
        .getParagraphsByDispute(action.payload.disputeId)
        .pipe(
          map(pleadings => {
            let pleadingsArray: Array<Pleading> = [];
            if (pleadings && pleadings.length > 0) {
              pleadingsArray = pleadings.map(e => {
                return {...e, disputeId: action.payload.disputeId};
              });
            }
            return new pleadingActions.LoadParagraphsSuccess({
              disputeIdOfEntries: action.payload.disputeId,
              paragraphs: pleadingsArray
            });
          }),
          catchError(() => of(new pleadingActions.LoadParagraphsFail({failedAction: action})))
        );
    })
  );

  @Effect()
  onLoadParagraphsSuccess$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_PARAGRAPHS_SUCCESS),
    map((action: pleadingActions.LoadParagraphsSuccess) => action.payload),
    switchMap((payload) => {
      return timer(appConfig.getDataSilentTimer).pipe(
        mapTo(payload.disputeIdOfEntries)
      );
    }),
    withLatestFrom(this.store.pipe(select(getRouterState))),
    filter(([disputeId, routerState]) => {
      return routerState.state.url.includes(disputeId);
    }),
    map(([disputeId]) => {
      return new pleadingActions.LoadParagraphsSilent({disputeId});
    })
  );

  @Effect()
  createParagraph$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_PARAGRAPH),
    map((action: pleadingActions.CreateParagraph) => action),
    switchMap(action => {
      return this.pleadingsService
        .createParagraph(action.payload)
        .pipe(
          map((res) => new pleadingActions.CreateParagraphSuccess(res)),
          catchError(() => of(new pleadingActions.CreateParagraphFail({failedAction: action})))
        );
    })
  );

  @Effect()
  updateParagraph$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_PARAGRAPH),
    map((action: pleadingActions.UpdateParagraph) => action),
    switchMap(action => {
      return this.pleadingsService
        .updateParagraph(action.payload)
        .pipe(
          map(() => new pleadingActions.UpdateParagraphSuccess()),
          catchError(() => of(new pleadingActions.UpdateParagraphFail({failedAction: action})))
        );
    })
  );

  @Effect()
  removeParagraph$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_PARAGRAPH),
    map((action: pleadingActions.RemoveParagraph) => action),
    switchMap(action => {
      return this.pleadingsService
        .removeParagraph(action.payload)
        .pipe(
          map(() => new pleadingActions.RemoveParagraphSuccess(action.payload)),
          catchError(() => of(new pleadingActions.RemoveParagraphFail({failedAction: action})))
        );
    })
  );

  @Effect()
  createResponse$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_RESPONSE),
    map((action: pleadingActions.CreateResponse) => action),
    switchMap(action => {
      return this.pleadingsService
        .createResponse(action.payload)
        .pipe(
          map((res) => new pleadingActions.CreateResponseSuccess(res)),
          catchError(() => of(new pleadingActions.CreateResponseFail({failedAction: action})))
        );
    })
  );

  @Effect()
  updateResponse$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_RESPONSE),
    map((action: pleadingActions.UpdateResponse) => action),
    switchMap(action => {
      return this.pleadingsService
        .updateResponse(action.payload)
        .pipe(
          map(() => new pleadingActions.UpdateResponseSuccess()),
          catchError(() => of(new pleadingActions.UpdateResponseFail({failedAction: action})))
        );
    })
  );

  @Effect()
  removeResponse$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_RESPONSE),
    map((action: pleadingActions.RemoveResponse) => action),
    switchMap(action => {
      return this.pleadingsService
        .removeResponse(action.payload)
        .pipe(
          map(() => new pleadingActions.RemoveResponseSuccess(action.payload)),
          catchError(() => of(new pleadingActions.RemoveResponseFail({failedAction: action})))
        );
    })
  );

  @Effect()
  addParagraphSentences$ = this.actions$.pipe(
    ofType(actionTypes.ADD_PARAGRAPH_SENTENCES),
    map((action: pleadingActions.AddParagraphSentences) => action),
    switchMap(action => {
      return this.pleadingsService
        .addParagraphSentences(action.payload)
        .pipe(
          map((res) => new pleadingActions.AddParagraphSentencesSuccess(res)),
          catchError(() => of(new pleadingActions.AddParagraphSentencesFail({failedAction: action})))
        );
    })
  );

  @Effect()
  addResponseSentences$ = this.actions$.pipe(
    ofType(actionTypes.ADD_RESPONSE_SENTENCES),
    map((action: pleadingActions.AddResponseSentences) => action),
    switchMap(action => {
      return this.pleadingsService
        .addResponseSentences(action.payload)
        .pipe(
          map((res) => new pleadingActions.AddResponseSentencesSuccess(res)),
          catchError(() => of(new pleadingActions.AddResponseSentencesFail({failedAction: action})))
        );
    })
  );

  @Effect()
  updateSentences$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_SENTENCE),
    map((action: pleadingActions.UpdateSentence) => action),
    switchMap(action => {
      const updateSentenceModel: UpdateSentenceModel = {
        disputeId: action.payload.disputeId,
        id: action.payload.sentence.id,
        newText: action.payload.sentence.text
      };
      return this.pleadingsService
        .updateSentence(updateSentenceModel)
        .pipe(
          map((res) => new pleadingActions.UpdateSentenceSuccess(res)),
          catchError(() => of(new pleadingActions.UpdateSentenceFail({failedAction: action})))
        );
    })
  );

  @Effect()
  removeSentence$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_SENTENCE),
    map((action: pleadingActions.RemoveSentence) => action),
    switchMap(action => {
      const removeSentenceModel: RemoveSentenceModel = {
        disputeId: action.payload.disputeId,
        id: action.payload.sentence.id
      };
      return this.pleadingsService
        .removeSentence(removeSentenceModel)
        .pipe(
          map((res) => new pleadingActions.RemoveSentenceSuccess(res)),
          catchError(() => of(new pleadingActions.RemoveSentenceFail({failedAction: action})))
        );
    })
  );

  @Effect()
  assignSentenceToIssue$ = this.actions$.pipe(
    ofType(actionTypes.ASSIGN_SENTENCE_TO_ISSUE),
    map((action: pleadingActions.AssignSentenceToIssue) => action),
    concatMap(action => {
      const assignSentenceToIssueModel = {
        disputeId: action.payload.disputeId,
        sentenceId: action.payload.sentence.id,
        issueIds: action.payload.sentence.issueIds
      };
      return this.pleadingsService
        .assignSentenceToIssue(assignSentenceToIssueModel)
        .pipe(
          map((res) => new pleadingActions.AssignSentenceToIssueSuccess(res)),
          catchError(() => of(new pleadingActions.AssignSentenceToIssueFail({failedAction: action})))
        );
    })
  );

  @Effect()
  removeSentencesFromIssue = this.actions$.pipe(
    ofType(actionTypes.REMOVE_SENTENCES_FROM_ISSUE),
    map((action: pleadingActions.RemoveSentencesFromIssue) => action),
    concatMap(action => {
      const removeModel = {
        disputeId: action.payload.disputeId,
        issueId: action.payload.issueId,
        sentenceIds: action.payload.sentenceIds
      };
      return this.pleadingsService
        .removeIssueIdsFromSentence(removeModel)
        .pipe(
          map(() => new pleadingActions.RemoveSentencesFromIssueSuccess()),
          catchError(() => of(new pleadingActions.RemoveSentencesFromIssueFail({failedAction: action})))
        );
    })
  );

  @Effect()
  setParagraphOrdering$ = this.actions$.pipe(
    ofType(actionTypes.SET_PARAGRAPH_ORDER),
    map((action: pleadingActions.SetParagraphOrder) => action),
    switchMap(action => {
      return this.pleadingsService
        .setParagraphOrdering(action.payload)
        .pipe(
          map(() => new pleadingActions.SetParagraphOrderSuccess()),
          catchError(() => of(new pleadingActions.SetParagraphOrderFail({failedAction: action})))
        );
    })
  );

  @Effect()
  handleCreateParagraphError$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_PARAGRAPH_FAIL),
    map(() => new Undo(actionTypes.CREATE_PARAGRAPH))
  );

  @Effect()
  handleUpdateParagraphError$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_PARAGRAPH_FAIL),
    map(() => new Undo(actionTypes.UPDATE_PARAGRAPH))
  );

  @Effect()
  handleDeleteParagraphError$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_SENTENCE_FAIL),
    map(() => new Undo(actionTypes.REMOVE_PARAGRAPH))
  );
  @Effect()
  handleCreateResponseError$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_RESPONSE_FAIL),
    map(() => new Undo(actionTypes.CREATE_RESPONSE))
  );

  @Effect()
  handleDeleteResponseError$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_RESPONSE_FAIL),
    map(() => new Undo(actionTypes.REMOVE_RESPONSE))
  );

  @Effect()
  handleAddParagraphSentencesError$ = this.actions$.pipe(
    ofType(actionTypes.ADD_PARAGRAPH_SENTENCES_FAIL),
    map(() => new Undo(actionTypes.ADD_PARAGRAPH_SENTENCES))
  );

  @Effect()
  handleUpdateSentencesError$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_SENTENCE_FAIL),
    map(() => new Undo(actionTypes.UPDATE_SENTENCE))
  );

  @Effect()
  handleRemoveSentencesError$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_SENTENCE_FAIL),
    map(() => new Undo(actionTypes.REMOVE_SENTENCE))
  );

  @Effect()
  handleAssignSentenceToIssueError$ = this.actions$.pipe(
    ofType(actionTypes.ASSIGN_SENTENCE_TO_ISSUE_FAIL),
    map(() => new Undo(actionTypes.ASSIGN_SENTENCE_TO_ISSUE))
  );

  @Effect()
  handleRemoveSentenceFromIssueError$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_SENTENCES_FROM_ISSUE_FAIL),
    map(() => new Undo(actionTypes.REMOVE_SENTENCES_FROM_ISSUE))
  );
  @Effect()
  handleSetParagraphOrderingError$ = this.actions$.pipe(
    ofType(actionTypes.SET_PARAGRAPH_ORDER_FAIL),
    map(() => new Undo(actionTypes.SET_PARAGRAPH_ORDER))
  );
}
