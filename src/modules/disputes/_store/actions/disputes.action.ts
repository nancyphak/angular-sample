import { Action } from '@ngrx/store';

import { Error } from 'modules/app/_store';
import { Dispute } from '../../models';
import * as actionTypes from './dispute-action-type';

export class LoadDisputes implements Action {
  readonly type = actionTypes.LOAD_DISPUTES;

  constructor(public payload?: any) {
  }
}

export class LoadDisputesSilent implements Action {
  readonly type = actionTypes.LOAD_DISPUTES_SILENT;

  constructor(public payload?: any) {
  }
}

export class LoadDisputesSuccess implements Action {
  readonly type = actionTypes.LOAD_DISPUTES_SUCCESS;

  constructor(public payload: { disputes: Dispute[] }) {
  }
}

export class LoadDisputesFail implements Action {
  readonly type = actionTypes.LOAD_DISPUTES_FAIL;

  constructor(public payload: Error) {
  }
}

export class SelectDispute implements Action {
  readonly type = actionTypes.SELECT_DISPUTE;

  constructor(public payload: string) {
  }
}

export class CreateDispute implements Action {
  readonly type = actionTypes.CREATE_DISPUTE;

  constructor(public payload: {
    id: string;
    name: string;
    timeCreated: string;
  }) {
  }
}

export class CreateDisputeSuccess implements Action {
  readonly type = actionTypes.CREATE_DISPUTE_SUCCESS;

  constructor(public payload: Dispute) {
  }
}

export class CreateDisputeFail implements Action {
  readonly type = actionTypes.CREATE_DISPUTE_FAIL;

  constructor(public payload: Error) {
  }
}

export class UpdateDispute implements Action {
  readonly type = actionTypes.UPDATE_DISPUTE;

  constructor(public payload: Dispute) {
  }
}

export class UpdateDisputeSuccess implements Action {
  readonly type = actionTypes.UPDATE_DISPUTE_SUCCESS;

  constructor(public payload: { dispute: { id: string, changes: Dispute } }) {
  }
}

export class UpdateDisputeFail implements Action {
  readonly type = actionTypes.UPDATE_DISPUTE_FAIL;

  constructor(public payload: Error) {
  }
}

export class RemoveDispute implements Action {
  readonly type = actionTypes.REMOVE_DISPUTE;

  constructor(public payload: Dispute) {
  }
}

export class RemoveDisputeSuccess implements Action {
  readonly type = actionTypes.REMOVE_DISPUTE_SUCCESS;

  constructor(public payload: Dispute) {
  }
}

export class RemoveDisputeFail implements Action {
  readonly type = actionTypes.REMOVE_DISPUTE_FAIL;

  constructor(public payload: Error) {
  }
}

export type DisputesAction =
  | LoadDisputes | LoadDisputesFail | LoadDisputesSuccess | LoadDisputesSilent
  | SelectDispute
  | CreateDispute | CreateDisputeFail | CreateDisputeSuccess
  | UpdateDispute | UpdateDisputeFail | UpdateDisputeSuccess
  | RemoveDispute | RemoveDisputeFail | RemoveDisputeSuccess;

