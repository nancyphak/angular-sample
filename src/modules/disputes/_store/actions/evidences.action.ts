import { Action } from '@ngrx/store';

import { Error } from 'modules/app/_store';
import { CreateEvidenceModel, Evidence } from '../../models';
import * as actionTypes from './evidence-action-type';

export class CreateEvidence implements Action {
  readonly type = actionTypes.CREATE_EVIDENCE;

  constructor(public payload: CreateEvidenceModel) {
  }
}

export class CreateEvidenceSuccess implements Action {
  readonly type = actionTypes.CREATE_EVIDENCE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateEvidenceFail implements Action {
  readonly type = actionTypes.CREATE_EVIDENCE_FAIL;

  constructor(public payload: Error) {
  }
}

export class GetEvidencesByDispute implements Action {
  readonly type = actionTypes.GET_EVIDENCES_BY_DISPUTE;

  constructor(public payload: { disputeId: string }) {
  }
}

export class GetEvidencesByDisputeSilent implements Action {
  readonly type = actionTypes.GET_EVIDENCES_BY_DISPUTE_SILENT;

  constructor(public payload: { disputeId: string }) {
  }
}

export class GetEvidencesByDisputeSuccess implements Action {
  readonly type = actionTypes.GET_EVIDENCES_BY_DISPUTE_SUCCESS;

  constructor(public payload: { disputeIdOfEvidenceEntries: string, evidences: Array<Evidence> }) {
  }
}

export class GetEvidencesByDisputeFail implements Action {
  readonly type = actionTypes.GET_EVIDENCES_BY_DISPUTE_FAIL;

  constructor(public payload?: any) {
  }
}

export class UpdateEvidence implements Action {
  readonly type = actionTypes.UPDATE_EVIDENCE;

  constructor(public payload: Evidence) {
  }
}

export class UpdateEvidenceSuccess implements Action {
  readonly type = actionTypes.UPDATE_EVIDENCE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateEvidenceFail implements Action {
  readonly type = actionTypes.UPDATE_EVIDENCE_FAIL;

  constructor(public payload: Error) {
  }
}

export class DeleteEvidence implements Action {
  readonly type = actionTypes.DELETE_EVIDENCE;

  constructor(public payload: Evidence) {
  }
}

export class DeleteEvidenceSuccess implements Action {
  readonly type = actionTypes.DELETE_EVIDENCE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class DeleteEvidenceFail implements Action {
  readonly type = actionTypes.DELETE_EVIDENCE_FAIL;

  constructor(public payload: Error) {
  }
}

export class EvidenceDragStarted implements Action {
  readonly type = actionTypes.EVIDENCE_DRAG_STARTED;
}

export class EvidenceDropped implements Action {
  readonly type = actionTypes.EVIDENCE_DROPPED;
}

export type EvidencesAction =
  | CreateEvidence | CreateEvidenceSuccess | CreateEvidenceFail
  | UpdateEvidence | UpdateEvidenceSuccess | UpdateEvidenceFail
  | DeleteEvidence | DeleteEvidenceSuccess | DeleteEvidenceFail
  | GetEvidencesByDispute | GetEvidencesByDisputeSuccess | GetEvidencesByDisputeFail | GetEvidencesByDisputeSilent
  | EvidenceDragStarted | EvidenceDropped;


