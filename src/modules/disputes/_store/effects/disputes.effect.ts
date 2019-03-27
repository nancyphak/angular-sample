import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Undo } from 'modules/app/_store';
import { of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { appConfig } from '@app/config';
import { UpdateDisputeModel } from '../../models';
import { DisputesService } from '../../services';
import * as disputesActions from '../actions/disputes.action';
import * as actionTypes from '../actions/dispute-action-type';

@Injectable()
export class DisputesEffects {
  constructor(private actions$: Actions,
    private disputeService: DisputesService) {
  }

  @Effect()
  loadDisputes$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_DISPUTES, actionTypes.LOAD_DISPUTES_SILENT),
    map((action: disputesActions.LoadDisputes) => action),
    switchMap((action) => {
      return this.disputeService
        .getDisputes()
        .pipe(
          map(disputes => new disputesActions.LoadDisputesSuccess({ disputes: disputes })),
          catchError(() => of(new disputesActions.LoadDisputesFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  onLoadDisputeSuccess$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_DISPUTES_SUCCESS),
    switchMap(() => timer(appConfig.getDataSilentTimer)),
    map(() => {
      return new disputesActions.LoadDisputesSilent();
    })
  );

  @Effect()
  createDispute$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_DISPUTE),
    map((action: disputesActions.CreateDispute) => action),
    switchMap(action => {
      return this.disputeService
        .createDispute(action.payload)
        .pipe(
          map(dispute => new disputesActions.CreateDisputeSuccess(dispute)),
          catchError(() => of(new disputesActions.CreateDisputeFail({
            failedAction: action
          })))
        );
    })
  );

  @Effect()
  updateDispute$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_DISPUTE),
    map((action: disputesActions.UpdateDispute) => action),
    switchMap(action => {
      const renameModel: UpdateDisputeModel = { disputeId: action.payload.id, newName: action.payload.name };
      return this.disputeService
        .updateDispute(renameModel)
        .pipe(
          map(() => {
            return new disputesActions.UpdateDisputeSuccess({
              dispute: { id: action.payload.id, changes: action.payload }
            });
          }),
          catchError(() => {
            return of(new disputesActions.UpdateDisputeFail({ failedAction: action }));
          })
        );
    })
  );

  @Effect()
  removeDispute$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_DISPUTE),
    map((action: disputesActions.RemoveDispute) => action),
    switchMap(action => {
      return this.disputeService
        .removeDispute(action.payload)
        .pipe(
          map(() => new disputesActions.RemoveDisputeSuccess(action.payload)),
          catchError(() => of(new disputesActions.RemoveDisputeFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  handleCreateFail$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_DISPUTE_FAIL),
    map(() => new Undo(actionTypes.CREATE_DISPUTE))
  );

  @Effect()
  handleUpdateFail$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_DISPUTE_FAIL),
    map(() => new Undo(actionTypes.UPDATE_DISPUTE))
  );

  @Effect()
  handleDeleteFail$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_DISPUTE_FAIL),
    map(() => new Undo(actionTypes.REMOVE_DISPUTE))
  );
}
