import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromDisputes from './disputes.reducer';
import * as fromIssues from './issues.reducer';
import * as fromDocuments from './documents.reducer';
import * as fromEvidences from './evidences.reducer';
import * as fromPleadings from './pleadings.reducer';
import * as fromPeople from './people.reducer';
import * as fromChronologies from './chronologies.reducer';
import * as fromUploadFiles from './upload.reducer';
import * as fromShares from './shares.reducer';

export const accountFeatureName = 'account';

export const disputeFeatureName = 'dispute';

export interface DisputeState {
  issues: fromIssues.State;
  documents: fromDocuments.State;
  evidences: fromEvidences.State;
  people: fromPeople.State;
  pleadings: fromPleadings.State;
  chronologies: fromChronologies.State;
  uploadFlies: fromUploadFiles.State;
  shares: fromShares.State;
}

export interface AccountState {
  disputes: fromDisputes.State;
}

export const disputeReducers: ActionReducerMap<DisputeState> = {
  issues: fromIssues.reducer,
  documents: fromDocuments.reducer,
  evidences: fromEvidences.reducer,
  people: fromPeople.reducer,
  pleadings: fromPleadings.reducer,
  chronologies: fromChronologies.reducer,
  uploadFlies: fromUploadFiles.reducer,
  shares: fromShares.reducer

};

export const accountReducers: ActionReducerMap<AccountState> = {
  disputes: fromDisputes.reducer
};

export const getDisputeState = createFeatureSelector<DisputeState>(disputeFeatureName);

export const getAccountState = createFeatureSelector<AccountState>(accountFeatureName);
