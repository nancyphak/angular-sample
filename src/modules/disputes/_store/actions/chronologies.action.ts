import { Action } from '@ngrx/store';

import { Error } from 'modules/app/_store';
import * as actionTypes from './chronology-action-type';
import { Chronology } from '../../models/chronology.model';

export class LoadChronologies implements Action {
  readonly type = actionTypes.LOAD_CHRONOLOGIES;

  constructor(public payload: { disputeId: string }) {
  }
}

export class LoadChronologiesSilent implements Action {
  readonly type = actionTypes.LOAD_CHRONOLOGIES_SILENT;

  constructor(public payload: { disputeId: string }) {
  }
}

export class LoadChronologiesSuccess implements Action {
  readonly type = actionTypes.LOAD_CHRONOLOGIES_SUCCESS;

  constructor(public payload: { disputeIdOfEntries: string, chronologies: Array<Chronology> }) {
  }
}

export class LoadChronologiesFail implements Action {
  readonly type = actionTypes.LOAD_CHRONOLOGIES_FAIL;

  constructor(public payload: Error) {
  }
}

export class CreateChronology implements Action {
  readonly type = actionTypes.CREATE_CHRONOLOGY;

  constructor(public payload: any) {
  }
}

export class CreateChronologySuccess implements Action {
  readonly type = actionTypes.CREATE_CHRONOLOGY_SUCCESS;

  constructor(public payload: Chronology) {
  }
}

export class CreateChronologyFail implements Action {
  readonly type = actionTypes.CREATE_CHRONOLOGY_FAIL;

  constructor(public payload?: Error) {
  }
}

export class RemoveChronology implements Action {
  readonly type = actionTypes.REMOVE_CHRONOLOGY;

  constructor(public payload: any) {
  }
}

export class RemoveChronologySuccess implements Action {
  readonly type = actionTypes.REMOVE_CHRONOLOGY_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class RemoveChronologyFail implements Action {
  readonly type = actionTypes.REMOVE_CHRONOLOGY_FAIL;

  constructor(public payload?: Error) {
  }
}

export class UpdateChronology implements Action {
  readonly type = actionTypes.UPDATE_CHRONOLOGY;

  constructor(public payload: Chronology) {
  }
}

export class UpdateChronologySuccess implements Action {
  readonly type = actionTypes.UPDATE_CHRONOLOGY_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateChronologyFail implements Action {
  readonly type = actionTypes.UPDATE_CHRONOLOGY_FAIL;

  constructor(public payload?: Error) {
  }
}

export type ChronologiesAction =
  | LoadChronologies | LoadChronologiesSuccess | LoadChronologiesFail | LoadChronologiesSilent
  | CreateChronology | CreateChronologySuccess | CreateChronologyFail
  | UpdateChronology | UpdateChronologySuccess | UpdateChronologyFail
  | RemoveChronology | RemoveChronologySuccess | RemoveChronologyFail;
