import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Undo } from 'modules/app/_store';
import { of, timer } from 'rxjs';
import { catchError, map, switchMap, mapTo } from 'rxjs/operators';
import * as sharesActions from '../actions/shares.action';
import * as actionTypes from '../actions/share-action-type';
import { SharesService } from '../../services';
import { ShareDisputeModel } from '../../models';

@Injectable()
export class SharesEffects {
  constructor(private actions$: Actions,
              private sharesService: SharesService) {
  }

  @Effect()
  loadSharesDisputes$ = this.actions$.pipe(
    ofType(actionTypes.LOAD_SHARES),
    map((action: sharesActions.LoadShares) => action),
    switchMap((action) => {
      return this.sharesService
        .getSharesByDispute(action.payload)
        .pipe(
          map((shares) => {
            let sharesArray: Array<ShareDisputeModel> = [];
            if (shares && shares.length > 0) {
              sharesArray = shares.map(e => {
                return {id: e.id, disputeId: action.payload, email: e.user, status: e.status};
              });
            }
            return new sharesActions.LoadSharesSuccess(sharesArray);
          }),
          catchError(() => of(new sharesActions.LoadSharesFail({failedAction: action})))
        );
    })
  );

  @Effect()
  createShareDispute$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_SHARE),
    map((action: sharesActions.CreateShare) => action),
    switchMap(action => {
      return this.sharesService
        .createShare(action.payload)
        .pipe(
          map(res => new sharesActions.CreateShareSuccess(res)),
          catchError(() => of(new sharesActions.CreateShareFail({
            failedAction: action
          })))
        );
    })
  );

  @Effect()
  removeShareDispute$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_SHARE),
    map((action: sharesActions.RemoveShare) => action),
    switchMap(action => {
      return this.sharesService
        .removeShare(action.payload)
        .pipe(
          map(() => new sharesActions.RemoveShareSuccess(action.payload)),
          catchError(() => of(new sharesActions.RemoveShareFail({failedAction: action})))
        );
    })
  );

  @Effect()
  handleCreateFail$ = this.actions$.pipe(
    ofType(actionTypes.CREATE_SHARE_FAIL),
    map(() => new Undo(actionTypes.CREATE_SHARE))
  );

  @Effect()
  handleDeleteFail$ = this.actions$.pipe(
    ofType(actionTypes.REMOVE_SHARE_FAIL),
    map(() => new Undo(actionTypes.REMOVE_SHARE))
  );
}
