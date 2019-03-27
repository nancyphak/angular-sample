import { Injectable } from '@angular/core';
import { of, timer } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, mapTo, withLatestFrom, filter } from 'rxjs/operators';

import { appConfig } from '@app/config';
import * as actionTypes from '../actions/chronology-action-type';
import * as chronologyActions from '../actions/chronologies.action';
import { ChronologiesService } from '../../services';
import { Chronology } from '../../models';
import { Undo, getRouterState } from '../../../app/_store';
import * as fromStore from '../index';

@Injectable()
export class ChronologiesEffects {
  constructor(private actions$: Actions,
    private store: Store<fromStore.DisputeState>,
    private chronologiesService: ChronologiesService) {
  }

  @Effect()
  loadCustomEvents$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_CHRONOLOGIES, actionTypes.LOAD_CHRONOLOGIES_SILENT),
    map((action: chronologyActions.LoadChronologies) => action),
    switchMap((action) => {
      return this.chronologiesService
        .getChronologyEventsByDispute(action.payload.disputeId)
        .pipe(
          map(chronologies => {
            let chronologiesArray: Array<Chronology> = [];
            if (chronologies && chronologies.length > 0) {
              chronologiesArray = chronologies.map(e => {
                return { ...e, disputeId: action.payload.disputeId };
              });
            }
            return new chronologyActions.LoadChronologiesSuccess({
              chronologies: chronologiesArray,
              disputeIdOfEntries: action.payload.disputeId
            });
          }),
          catchError(() => of(new chronologyActions.LoadChronologiesFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  onLoadEventsSuccess$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_CHRONOLOGIES_SUCCESS),
    map((action: chronologyActions.LoadChronologiesSuccess) => action.payload),
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
      return new chronologyActions.LoadChronologiesSilent({ disputeId });
    })
  );

  @Effect()
  createCustomEvent$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_CHRONOLOGY),
    map((action: chronologyActions.CreateChronology) => action),
    switchMap(action => {
      return this.chronologiesService
        .createChronologyEvent(action.payload)
        .pipe(
          map((res) => new chronologyActions.CreateChronologySuccess(res)),
          catchError(() => of(new chronologyActions.CreateChronologyFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  updateCustomEvent$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_CHRONOLOGY),
    map((action: chronologyActions.UpdateChronology) => action),
    switchMap(action => {
      return this.chronologiesService
        .updateChronologyEvent(action.payload)
        .pipe(
          map((res) => new chronologyActions.UpdateChronologySuccess(res)),
          catchError(() => of(new chronologyActions.UpdateChronologyFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  removeCustomEvent$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_CHRONOLOGY),
    map((action: chronologyActions.RemoveChronology) => action),
    switchMap(action => {
      return this.chronologiesService
        .removeChronologyEvent(action.payload)
        .pipe(
          map(() => new chronologyActions.RemoveChronologySuccess()),
          catchError(() => of(new chronologyActions.RemoveChronologyFail({ failedAction: action })))
        );
    })
  );

  @Effect()
  handleCreateCustomEventError$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_CHRONOLOGY_FAIL),
    map(() => new Undo(actionTypes.CREATE_CHRONOLOGY))
  );

  @Effect()
  handleUpdateCustomEventError$ = this.actions$.pipe(
    ofType(actionTypes.UPDATE_CHRONOLOGY_FAIL),
    map(() => new Undo(actionTypes.UPDATE_CHRONOLOGY))
  );

  @Effect()
  handleRemoveCustomEventError$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_CHRONOLOGY_FAIL),
    map(() => new Undo(actionTypes.REMOVE_CHRONOLOGY))
  );
}
