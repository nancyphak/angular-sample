import { Action } from '@ngrx/store';

import { Error } from 'modules/app/_store';
import { CreateShareDisputeModel, DeleteShareDisputeModel, ShareDisputeModel } from '../../models';
import * as actionTypes from './share-action-type';

export class LoadShares implements Action {
  readonly type = actionTypes.LOAD_SHARES;

  constructor(public payload: string) {
  }
}

export class LoadSharesSuccess implements Action {
  readonly type = actionTypes.LOAD_SHARES_SUCCESS;

  constructor(public payload: ShareDisputeModel[]) {
  }
}

export class LoadSharesFail implements Action {
  readonly type = actionTypes.LOAD_SHARES_FAIL;

  constructor(public payload: Error) {
  }
}

export class CreateShare implements Action {
  readonly type = actionTypes.CREATE_SHARE;

  constructor(public payload: CreateShareDisputeModel) {
  }
}

export class CreateShareSuccess implements Action {
  readonly type = actionTypes.CREATE_SHARE_SUCCESS;

  constructor(public payload: ShareDisputeModel) {
  }
}

export class CreateShareFail implements Action {
  readonly type = actionTypes.CREATE_SHARE_FAIL;

  constructor(public payload: Error) {
  }
}

export class RemoveShare implements Action {
  readonly type = actionTypes.REMOVE_SHARE;

  constructor(public payload: DeleteShareDisputeModel) {
  }
}

export class RemoveShareSuccess implements Action {
  readonly type = actionTypes.REMOVE_SHARE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class RemoveShareFail implements Action {
  readonly type = actionTypes.REMOVE_SHARE_FAIL;

  constructor(public payload: Error) {
  }
}

export type SharesAction =
  | LoadShares | LoadSharesFail | LoadSharesSuccess
  | CreateShare | CreateShareFail | CreateShareSuccess
  | RemoveShare | RemoveShareFail | RemoveShareSuccess;

