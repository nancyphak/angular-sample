import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, timer } from 'rxjs';
import { catchError, map, switchMap, mapTo, withLatestFrom, filter } from 'rxjs/operators';

import { appConfig } from '@app/config';
import { EvidencesService } from '../../services';
import * as evidencesActions from '../actions/evidences.action';
import * as actionTypes from '../actions/evidence-action-type';
import { Undo, getRouterState } from '../../../app/_store';
import { Evidence } from '../../models';
import * as fromStore from '../index';

@Injectable()
export class EvidenceEffects {
  constructor(private actions$: Actions,
    private store: Store<fromStore.DisputeState>,
    private evidencesService: EvidencesService) {
  }

  @Effect()
  createEvidence$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_EVIDENCE),
    map((action: evidencesActions.CreateEvidence) => action),
    switchMap(action => {
      return this.evidencesService
        .createEvidence(action.payload)
        .pipe(
          map(evidence => new evidencesActions.CreateEvidenceSuccess(evidence)),
          catchError(() => of(new evidencesActions.CreateEvidenceFail({
            failedAction: action
          })))
        );
    })
  );

  @Effect()
  getEvidencesByDispute$ = this.actions$.pipe(
    ofType(actionTypes.GET_EVIDENCES_BY_DISPUTE, actionTypes.GET_EVIDENCES_BY_DISPUTE_SILENT),
    map((action: evidencesActions.GetEvidencesByDispute) => action),
    switchMap((action) => {
      return this.evidencesService
        .getEvidencesByDispute(action.payload.disputeId)
        .pipe(
          map((evidences: Array<Evidence>) => {
            evidences.map(item => {
              item.disputeId = action.payload.disputeId;
              item.issues = [];
              return item;
            });
            return new evidencesActions.GetEvidencesByDisputeSuccess({
              evidences: evidences,
              disputeIdOfEvidenceEntries: action.payload.disputeId
            });
          }),
          catchError(() => of(new evidencesActions.GetEvidencesByDisputeFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  onGetEvidencesByDisputeSuccess$ = this.actions$.pipe(
    ofType(actionTypes.GET_EVIDENCES_BY_DISPUTE_SUCCESS),
    map((action: evidencesActions.GetEvidencesByDisputeSuccess) => action.payload),
    switchMap((payload) => {
      return timer(appConfig.getDataSilentTimer).pipe(
        mapTo(payload.disputeIdOfEvidenceEntries)
      );
    }),
    withLatestFrom(this.store.pipe(select(getRouterState))),
    filter(([disputeId, routerState]) => {
      return routerState.state.url.includes(disputeId);
    }),
    map(([disputeId]) => {
      return new evidencesActions.GetEvidencesByDisputeSilent({ disputeId });
    })
  );

  @Effect()
  updateEvidence$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_EVIDENCE),
    map((action: evidencesActions.UpdateEvidence) => action),
    switchMap(action => {
      return this.evidencesService
        .updateEvidence(action.payload)
        .pipe(
          map((res) => new evidencesActions.UpdateEvidenceSuccess(res)),
          catchError(() => of(new evidencesActions.UpdateEvidenceFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  removeEvidence$ = this.actions$.pipe(
    ofType(actionTypes.DELETE_EVIDENCE),
    map((action: evidencesActions.DeleteEvidence) => action),
    switchMap(action => {
      return this.evidencesService
        .removeEvidence(action.payload)
        .pipe(
          map((res) => new evidencesActions.DeleteEvidenceSuccess(res)),
          catchError(() => of(new evidencesActions.DeleteEvidenceFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  handleCreateFail$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_EVIDENCE_FAIL),
    map(() => new Undo(actionTypes.CREATE_EVIDENCE))
  );

  @Effect()
  handleUpdateFail$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_EVIDENCE_FAIL),
    map(() => new Undo(actionTypes.UPDATE_EVIDENCE))
  );

  @Effect()
  handleDeleteFail$ = this.actions$.pipe(
    ofType(actionTypes.DELETE_EVIDENCE_FAIL),
    map(() => new Undo(actionTypes.DELETE_EVIDENCE))
  );

}
